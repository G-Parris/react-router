import { Form, redirect, type ActionFunctionArgs } from "react-router";
import { supabase } from "~/supabase-client";

export function meta() {
    return [{ title: "Create Task" }];
}

export async function action({request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const taskName = formData.get("task-name") as string;
    const taskDescription = formData.get("task-description") as string;
    const taskDueDate = formData.get("task-due-date") as string;
    const taskPriority = formData.get("task-priority") as string;
    const updated_at = new Date().toISOString();

    if (!taskName || !taskDescription || !taskDueDate || !taskPriority) {
        return {error: "All fields are required."};
    }

    const { error } = await supabase.from("tasks").insert({
        taskName, 
        taskDescription, 
        taskDueDate, 
        taskPriority,
        updated_at
    }).select("*").single();

    if (error) {
        return {error: error.message};
    }

    return redirect("/");
}

export default function NewTask() {
    return <div className="max-w-md mx-auto"><h2 className="font-bold mb-4 text-2xl">Create New Task</h2>
    <Form method="post" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div>
        <label className="block text-black-700 font-bold" htmlFor="task-name">
            Title
        </label>
        <input className="border border-gray-300 rounded px-3 py-2 w-full" type="text" name="task-name" required></input>
    </div>
    <div>
        <label className="block text-black-700 font-bold">Description</label>
        <textarea className="border border-gray-300 rounded px-3 py-2 w-full" name="task-description" required></textarea>
        </div>
        <div>
            <label className="block text-black-700 font-bold">Due Date</label>
            <input className="border border-gray-300 rounded px-3 py-2 w-full" type="date" name="task-due-date" required></input>
        </div>
        <div className="mb-4 mt-4 border rounded border-gray-300 pt-2">
            <label className="block text-black-700 font-bold border-b mb-2">Priority:</label>
            <input className="mb-4 ml-1 accent-green-600" type="radio" name="task-priority" value="Low" required></input>
            <label className="text-green-600 ml-2">Low</label><br></br>
            <input className="mb-4 ml-1 accent-blue-500" type="radio" name="task-priority" value="Medium" required></input>
            <label className="text-blue-600 ml-2">Medium</label><br></br>
            <input className="mb-4 ml-1 accent-yellow-700" type="radio" name="task-priority" value="High" required></input>
            <label className="text-yellow-500 ml-2">High</label><br></br>
            <input className="mb-4 ml-1 accent-orange-600" type="radio" name="task-priority" value="Urgent" required></input>
            <label className="text-orange-600 ml-2">Urgent</label><br></br>
            <input className="ml-1 accent-red-500" type="radio" name="task-priority" value="Critical" required></input>
            <label className="text-red-600 ml-2">Critical</label>
        </div>
        <button className="bg-gray-500 text-white px-4 py-2 rounded mr-4 mt-2" type="button" onClick={() => window.history.back()}>Cancel</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Create Task</button>
    </Form>
    </div>;
}

