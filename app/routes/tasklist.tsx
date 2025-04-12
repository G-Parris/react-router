import { useLoaderData } from "react-router-dom";
import { supabase } from "~/supabase-client";
import { useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";

interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
  taskDueDate: string;
  taskPriority: string;
  status: string;
  fileUrl?: string;
  created_at: string;
  completed: boolean;
}

interface LoaderData {
  tasks: Task[];
  error?: string;
}

export function meta() {
  return [{ title: "Task List" }];
}

export async function loader() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, tasks: [] };
  }

  return { tasks: data || [] };
}

export default function Tasks() {
  const loaderData = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | undefined>(loaderData.error);
  
  useEffect(() => {
    setTasks(loaderData.tasks || []);
  }, [loaderData.tasks]);
  
  const urgentTasks = tasks.filter(
    (task) => 
      (task.taskPriority === "Urgent" || task.taskPriority === "Critical") && 
      task.status !== "Complete" && 
      !task.completed
  );
  
  const completedTasks = tasks.filter(task => task.completed || task.status === "Complete");
  
  const currentTasks = tasks.filter(
    task => 
      !task.completed && 
      task.status !== "Complete" &&
      task.taskPriority !== "Urgent" && 
      task.taskPriority !== "Critical"
  );
  
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement}>({});

  const handleFileInputRef = (el: HTMLInputElement | null, taskId: string) => {
    if (el) {
      fileInputRefs.current[taskId] = el;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      setUploading(prev => ({ ...prev, [taskId]: true }));
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('task-files')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('task-files')
        .getPublicUrl(fileName);

      // Update task with file URL
      const { error: updateError, data: updatedTask } = await supabase
        .from('tasks')
        .update({ fileUrl: publicUrl })
        .eq('id', taskId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state instead of refreshing the page
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, fileUrl: publicUrl } : task
        )
      );

    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error instanceof Error ? error.message : 'Error uploading file');
    } finally {
      setUploading(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error: updateError, data: updatedTask } = await supabase
        .from("tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", taskId)
        .select()
        .single();
          
      if (updateError) throw updateError;
      
      // Update local state instead of refreshing the page
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      setError(error instanceof Error ? error.message : 'Error updating task status');
    }
  };

  const handleMarkCompleted = async (taskId: string) => {
    try {
      const { error: updateError, data: updatedTask } = await supabase
        .from("tasks")
        .update({ 
          completed: true, 
          status: "Complete", 
          updated_at: new Date().toISOString() 
        })
        .eq("id", taskId)
        .select()
        .single();
          
      if (updateError) throw updateError;
      
      // Update local state instead of refreshing the page
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: true, status: "Complete" } : task
        )
      );
    } catch (error) {
      console.error("Error marking task as completed:", error);
      setError(error instanceof Error ? error.message : 'Error marking task as completed');
    }
  };

  const TaskList = ({tasks, title}: {tasks: Task[], title: string}) => (
    <div className="min-w-full flex-none px-4 snap-start">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" key={task.id}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <select 
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)} 
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    disabled={task.completed}
                  >
                    <option value="Incomplete">Incomplete</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                  </select>
                  <div className="mt-2">
                    <input
                      type="file"
                      ref={el => handleFileInputRef(el, task.id)}
                      onChange={(e) => handleFileUpload(e, task.id)}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRefs.current[task.id]?.click()}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      disabled={uploading[task.id] || task.completed}
                    >
                      {uploading[task.id] ? 'Uploading...' : 'Upload File'}
                    </button>
                    {task.fileUrl && (
                      <a
                        href={task.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline ml-2"
                      >
                        View File
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Task: {task.taskName}</h3>
                <span className={`font-bold ${
                  task.taskPriority === "Critical" ? "text-red-600" :
                  task.taskPriority === "Urgent" ? "text-orange-600" :
                  task.taskPriority === "High" ? "text-yellow-500" :
                  task.taskPriority === "Medium" ? "text-blue-600" :
                  "text-green-600"
                }`}>
                  Priority: {task.taskPriority}
                </span>
              </div>
              <p className="mb-2 text-gray-900">Description: {task.taskDescription}</p>
              <p className="mb-2 text-gray-900">Due Date: {task.taskDueDate}</p>
              <p className="mb-2 text-gray-900">Created At: {task.created_at}</p>
              <div className="flex space-x-2 mt-2">
                <button 
                  onClick={() => navigate(`/task/${task.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  disabled={task.completed}
                >
                  Edit Task
                </button>
                {!task.completed && (
                  <button 
                    onClick={() => handleMarkCompleted(task.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="container mx-auto overflow-hidden">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
      </div>
      {error && <p className="text-red-500 px-4 mb-4">{error}</p>}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        <TaskList tasks={completedTasks} title="Completed Tasks" />
        <TaskList tasks={currentTasks} title="Current Tasks" />
        <TaskList tasks={urgentTasks} title="Urgent Tasks" />

      </div>
    </div>
  );
}