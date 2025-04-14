import { useState } from "react";
import { supabase } from "../supabase-client";

export function meta() {
    return [{ title: "Create Task" }];
}

export default function NewTask() {
    const [form, setForm] = useState({
        "task-name": "",
        "task-description": "",
        "task-due-date": "",
        "task-priority": "Low"
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { "task-name": taskName, "task-description": taskDescription, "task-due-date": taskDueDate, "task-priority": taskPriority } = form;
        const updated_at = new Date().toISOString();
        if (!taskName || !taskDescription || !taskDueDate || !taskPriority) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }
        const { error } = await supabase.from("tasks").insert({
            taskName,
            taskDescription,
            taskDueDate,
            taskPriority,
            updated_at
        }).select("*").single();
        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }
        window.location.href = "/react-router/";
    };
    return <div className="max-w-md mx-auto"><h2 className="font-bold mb-4 text-2xl">Create New Task</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div>
                <label className="block text-black-700 font-bold" htmlFor="task-name">
                    Title
                </label>
                <input className="border border-gray-300 rounded px-3 py-2 w-full" type="text" name="task-name" required value={form["task-name"]} onChange={handleChange} />
            </div>
            <div>
                <label className="block text-black-700 font-bold">Description</label>
                <textarea className="border border-gray-300 rounded px-3 py-2 w-full" name="task-description" required value={form["task-description"]} onChange={handleChange}></textarea>
            </div>
            <div>
                <label className="block text-black-700 font-bold">Due Date</label>
                <input className="border border-gray-300 rounded px-3 py-2 w-full" type="date" name="task-due-date" required value={form["task-due-date"]} onChange={handleChange} />
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
            <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit" disabled={loading}>{loading ? "Creating..." : "Create Task"}</button>
        </form>
    </div>;
}

