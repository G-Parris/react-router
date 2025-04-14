import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useParams } from "react-router-dom";

export function meta() {
    return [{ title: `Editing Task` }];
}

export default function Task() {
    const { id } = useParams();
    const [task, setTask] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        "task-name": "",
        "task-description": "",
        "task-due-date": "",
        "task-priority": "Low"
    });

    useEffect(() => {
        if (!id) {
            setError("Task ID is required");
            setLoading(false);
            return;
        }
        supabase.from("tasks").select("*").eq("id", id).single().then(({ data, error }: { data: any; error: any }) => {
            if (error) {
                setError(error.message);
            } else {
                setTask(data);
                setForm({
                    "task-name": data.taskName || "",
                    "task-description": data.taskDescription || "",
                    "task-due-date": data.taskDueDate || "",
                    "task-priority": data.taskPriority || "Low"
                });
            }
            setLoading(false);
        });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { "task-name": taskName, "task-description": taskDescription, "task-due-date": taskDueDate, "task-priority": taskPriority } = form;
        const updated_at = new Date().toISOString();
        const intent = (e.nativeEvent as any).submitter?.value;
        if (intent === "delete") {
            const { error } = await supabase.from("tasks").delete().eq("id", id);
            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
            window.location.href = "/react-router/";
        } else if (intent === "update") {
            const { error } = await supabase.from("tasks").update({
                taskName,
                taskDescription,
                taskDueDate,
                taskPriority,
                updated_at
            }).eq("id", id);
            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
            window.location.href = "/react-router/";
        }
        setLoading(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!task) return <div>Task not found.</div>;
    return <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4"> Edit Task: {task.taskName}</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div>
                <label className="block text-black-700 font-bold" htmlFor="task-name">Title</label>
                <input className="border border-gray-300 rounded px-3 py-2 w-full" type="text" name="task-name" value={form["task-name"]} onChange={handleChange} required />
            </div>
            <div>
                <label className="block text-black-700 font-bold">Description</label>
                <textarea className="border border-gray-300 rounded px-3 py-2 w-full" name="task-description" value={form["task-description"]} onChange={handleChange} required></textarea>
            </div>
            <div>
                <label className="block text-black-700 font-bold">Due Date</label>
                <input className="border border-gray-300 rounded px-3 py-2 w-full" type="date" name="task-due-date" value={form["task-due-date"]} onChange={handleChange} required />
            </div>
            <div className="mb-4 mt-4 border rounded border-gray-300 pt-2">
                <label className="block text-black-700 font-bold border-b mb-2">Priority:</label>
                <input className="mb-4 ml-1 accent-green-600" type="radio" name="task-priority" value="Low" checked={form["task-priority"] === "Low"} onChange={handleChange} required />
                <label className="text-green-600 ml-2">Low</label><br />
                <input className="mb-4 ml-1 accent-blue-500" type="radio" name="task-priority" value="Medium" checked={form["task-priority"] === "Medium"} onChange={handleChange} required />
                <label className="text-blue-600 ml-2">Medium</label><br />
                <input className="mb-4 ml-1 accent-yellow-700" type="radio" name="task-priority" value="High" checked={form["task-priority"] === "High"} onChange={handleChange} required />
                <label className="text-yellow-500 ml-2">High</label><br />
                <input className="mb-4 ml-1 accent-orange-600" type="radio" name="task-priority" value="Urgent" checked={form["task-priority"] === "Urgent"} onChange={handleChange} required />
                <label className="text-orange-600 ml-2">Urgent</label><br />
                <input className="ml-1 accent-red-500" type="radio" name="task-priority" value="Critical" checked={form["task-priority"] === "Critical"} onChange={handleChange} required />
                <label className="text-red-600 ml-2">Critical</label>
            </div>
            <button className="bg-gray-500 text-white px-4 py-2 rounded mr-4 mt-2" type="button" onClick={() => window.history.back()}>Cancel</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded mr-4" value="update" name="intent" type="submit" disabled={loading}>{loading ? "Updating..." : "Update Task"}</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded" value="delete" name="intent" type="submit" disabled={loading}>{loading ? "Deleting..." : "Delete Task"}</button>
        </form>
    </div>;
}