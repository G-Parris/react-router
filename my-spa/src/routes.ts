import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/tasklist.tsx"), route("newtask", "routes/createtask.tsx"), route("task/:id", "routes/task.tsx")] satisfies RouteConfig;

