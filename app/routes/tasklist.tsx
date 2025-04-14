import { useEffect, useState, useRef } from "react";
import { supabase } from "~/supabase-client";
import { useNavigate } from "react-router";

interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
  taskDueDate: string;
  taskPriority: string;
  created_at: string;
  updated_at: string;
  completed: boolean;
  fileUrl?: string | null;
}

export function meta() {
  return [{ title: "Task List" }];
}

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setTasks([]);
        } else {
          setTasks(data || []);
          setError(undefined);
        }
        setLoading(false);
      });
  }, []);

  const urgentTasks = tasks.filter(
    (task) =>
      (task.taskPriority === "Urgent" || task.taskPriority === "Critical") &&
      !task.completed
  );

  const completedTasks = tasks.filter((task) => task.completed);

  const currentTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.taskPriority !== "Urgent" &&
      task.taskPriority !== "Critical"
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    taskId: string
  ) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      setUploading((prev) => ({ ...prev, [taskId]: true }));

      const timeStamp = new Date().getTime();
      const fileExt = file.name.split(".").pop();
      const fileName = `${timeStamp}-${Math.random()}.${fileExt}`;
      const filePath = `${taskId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("task-files")
        .upload(filePath, file, {
          upsert: true,
          cacheControl: "3600"
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("tasks")
        .update({ 
          fileUrl: publicUrl, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", taskId);

      if (updateError) throw updateError;

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, fileUrl: publicUrl } : task
        )
      );

      setError(undefined);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(
        error instanceof Error ? error.message : "Error uploading file"
      );
    } finally {
      setUploading((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const handleMarkCompleted = async (taskId: string) => {
    try {
      const { error: updateError } = await supabase
        .from("tasks")
        .update({
          completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId);

      if (updateError) throw updateError;

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );

      setError(undefined);
    } catch (error) {
      console.error("Error marking task as completed:", error);
      setError(
        error instanceof Error ? error.message : "Error marking task as completed"
      );
    }
  };

  const handleDeleteFile = async (taskId: string, fileUrl: string) => {
    try {
      const filePath = fileUrl.split('/').pop();
      if (!filePath) throw new Error("Invalid file URL");

      const { error: deleteError } = await supabase.storage
        .from("task-files")
        .remove([`${taskId}/${filePath}`]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from("tasks")
        .update({ 
          fileUrl: null, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", taskId);

      if (updateError) throw updateError;

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, fileUrl: null } : task
        )
      );

      setError(undefined);
    } catch (error) {
      console.error("Error deleting file:", error);
      setError(error instanceof Error ? error.message : "Error deleting file");
    }
  };

  const handleFileInputRef = (el: HTMLInputElement | null, taskId: string) => {
    if (el) {
      fileInputRefs.current[taskId] = el;
    }
  };

  const TaskList = ({
    tasks,
    title,
  }: {
    tasks: Task[];
    title: string;
  }) => (
    <div className="min-w-full flex-none px-4 snap-start">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              key={task.id}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    Task: {task.taskName}
                  </h3>
                  <div className="mt-2">
                    <input
                      type="file"
                      ref={(el) => handleFileInputRef(el, task.id)}
                      onChange={(e) => handleFileUpload(e, task.id)}
                      className="hidden"
                    />
                    {!task.completed && (
                      <button
                        onClick={() =>
                          fileInputRefs.current[task.id]?.click()
                        }
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm mr-2"
                        disabled={uploading[task.id]}
                      >
                        {uploading[task.id] ? "Uploading..." : "Upload File"}
                      </button>
                    )}
                    {task.fileUrl && (
                      <div className="flex items-center gap-2">
                        <a
                          href={task.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View File
                        </a>
                        {!task.completed && (
                          <button
                            onClick={() => handleDeleteFile(task.id, task.fileUrl!)}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            Delete File
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`font-bold ${
                    task.taskPriority === "Critical"
                      ? "text-red-600"
                      : task.taskPriority === "Urgent"
                      ? "text-orange-600"
                      : task.taskPriority === "High"
                      ? "text-yellow-500"
                      : task.taskPriority === "Medium"
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
                  Priority: {task.taskPriority}
                </span>
              </div>
              <p className="mb-2 text-gray-900">
                Description: {task.taskDescription}
              </p>
              <p className="mb-2 text-gray-900">Due Date: {task.taskDueDate}</p>
              <p className="mb-2 text-gray-900">Created At: {task.created_at}</p>
              <p className="mb-2 text-gray-900">
                {task.completed ? "Completed" : "Last Updated"}: {task.updated_at}
              </p>
              <div className="flex space-x-2 mt-2">
                {!task.completed && (
                  <>
                    <button
                      onClick={() => navigate(`/task/${task.id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Edit Task
                    </button>
                    <button
                      onClick={() => handleMarkCompleted(task.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Mark Complete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto overflow-hidden">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
      </div>
      {error && <p className="text-red-500 px-4 mb-4">{error}</p>}
      <div className="flex overflow-x-auto snap-x snap-mandatory">
        <TaskList tasks={completedTasks} title="Completed Tasks" />
        <TaskList tasks={currentTasks} title="Current Tasks" />
        <TaskList tasks={urgentTasks} title="Urgent Tasks" />
      </div>
    </div>
  );
}