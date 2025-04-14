import { supabase } from "~/supabase-client";
import type { Route } from "./+types/task";
import { Form, redirect, type ActionFunctionArgs } from "react-router";

export function meta({ params, data}: Route.MetaArgs) {
    const taskName = data?.task?.taskName ?? 'Unknown Task';
    return [{ title: `Editing Task: ${taskName}` }];

}


export async function loader({params}: Route.LoaderArgs) {
    const {id} = params

    if (!id) {
        return { error: "Task ID is required" };
    }

    const {data, error} = await supabase.from("tasks").select("*").eq("id", id).single();

    if (error) {
        return { error: error.message };
    }

    return { task: data };
}

export async function action({request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const taskName = formData.get("task-name") as string;
    const taskDescription = formData.get("task-description") as string;
    const taskDueDate = formData.get("task-due-date") as string;
    const taskPriority = formData.get("task-priority") as string;
    const intent = formData.get("intent") as string;
    const updated_at = new Date().toISOString();

    if (intent === "delete") {
        const { error } = await supabase.from("tasks").delete().eq("id", params.id);
        if (error) {
            return { error: error.message };
        }
        return redirect("/");
    } else if (intent === "update") {
        const { error } = await supabase.from("tasks").update({
            taskName, 
            taskDescription, 
            taskDueDate, 
            taskPriority,
            updated_at
        }).eq("id", params.id);
        if (error) {
            return { error: error.message };
        }
        return redirect("/");
    }
    return {};
}
  


export default function Task({loaderData}: Route.ComponentProps) {
    const { task, error } = loaderData; 
    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }
    if (!task) {
        return <div>Loading...</div>
    }
    return <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4"> Edit Task: {task.taskName}</h2>
        <Form method="post" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
        <label className="block text-black-700 font-bold" htmlFor="task-name">
            Title
        </label>
        <input className="border border-gray-300 rounded px-3 py-2 w-full" type="text" name="task-name" defaultValue={task.taskName} required></input>
    </div>
    <div>
        <label className="block text-black-700 font-bold">Description</label>
        <textarea className="border border-gray-300 rounded px-3 py-2 w-full" name="task-description" defaultValue={task.taskDescription} required></textarea>
        </div>
        <div>
            <label className="block text-black-700 font-bold">Due Date</label>
            <input className="border border-gray-300 rounded px-3 py-2 w-full" type="date" name="task-due-date" defaultValue={task.taskDueDate} required></input>
        </div>
        <div className="mb-4 mt-4 border rounded border-gray-300 pt-2">
            <label className="block text-black-700 font-bold border-b mb-2">Priority:</label>
            <input className="mb-4 ml-1 accent-green-600" type="radio" name="task-priority" defaultChecked={task.taskPriority === "Low"} value="Low" required></input>
            <label className="text-green-600 ml-2">Low</label><br></br>
            <input className="mb-4 ml-1 accent-blue-500" type="radio" name="task-priority"  defaultChecked={task.taskPriority === "Medium"} value="Medium" required></input>
            <label className="text-blue-600 ml-2">Medium</label><br></br>
            <input className="mb-4 ml-1 accent-yellow-700" type="radio" name="task-priority"  defaultChecked={task.taskPriority === "High"} value="High" required></input>
            <label className="text-yellow-500 ml-2">High</label><br></br>
            <input className="mb-4 ml-1 accent-orange-600" type="radio" name="task-priority"  defaultChecked={task.taskPriority === "Urgent"} value="Urgent" required></input>
            <label className="text-orange-600 ml-2">Urgent</label><br></br>
            <input className="ml-1 accent-red-500" type="radio" name="task-priority"  defaultChecked={task.taskPriority === "Critical"} value="Critical" required></input>
            <label className="text-red-600 ml-2">Critical</label>
        </div>
        <button className="bg-gray-500 text-white px-4 py-2 rounded mr-4 mt-2" type="button" onClick={() => window.history.back()}>Cancel</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded mr-4" value="update" name="intent" type="submit">Update Task</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" value="delete" name="intent" type="submit">Delete Task</button>
        </Form>
    </div>;
}