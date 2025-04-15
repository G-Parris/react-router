import{w as h}from"./with-props-CDnYio8N.js";import{r as d,l as e}from"./chunk-KNED5TY2-B--Pu_Kb.js";import{s as y}from"./supabase-client-CQQklyuL.js";function w(){return[{title:"Create Task"}]}const C=h(function(){const[t,p]=d.useState({"task-name":"","task-description":"","task-due-date":"","task-priority":"Low"}),[c,n]=d.useState(null),[m,i]=d.useState(!1),a=o=>{const{name:r,value:s}=o.target;p(l=>({...l,[r]:s}))},x=async o=>{o.preventDefault(),n(null),i(!0);const{"task-name":r,"task-description":s,"task-due-date":l,"task-priority":u}=t,k=new Date().toISOString();if(!r||!s||!l||!u){n("All fields are required."),i(!1);return}const{error:b}=await y.from("tasks").insert({taskName:r,taskDescription:s,taskDueDate:l,taskPriority:u,updated_at:k}).select("*").single();if(b){n(b.message),i(!1);return}window.location.href="/react-router/"};return e.jsxs("div",{className:"max-w-md mx-auto",children:[e.jsx("h2",{className:"font-bold mb-4 text-2xl",children:"Create New Task"}),e.jsxs("form",{onSubmit:x,className:"bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4",children:[c&&e.jsx("div",{className:"text-red-500 mb-2",children:c}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-black-700 font-bold",htmlFor:"task-name",children:"Title"}),e.jsx("input",{className:"border border-gray-300 rounded px-3 py-2 w-full",type:"text",name:"task-name",required:!0,value:t["task-name"],onChange:a})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-black-700 font-bold",children:"Description"}),e.jsx("textarea",{className:"border border-gray-300 rounded px-3 py-2 w-full",name:"task-description",required:!0,value:t["task-description"],onChange:a})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-black-700 font-bold",children:"Due Date"}),e.jsx("input",{className:"border border-gray-300 rounded px-3 py-2 w-full",type:"date",name:"task-due-date",required:!0,value:t["task-due-date"],onChange:a})]}),e.jsxs("div",{className:"mb-4 mt-4 border rounded border-gray-300 pt-2",children:[e.jsx("label",{className:"block text-black-700 font-bold border-b mb-2",children:"Priority:"}),e.jsx("input",{className:"mb-4 ml-1 accent-green-600",type:"radio",name:"task-priority",value:"Low",checked:t["task-priority"]==="Low",onChange:a,required:!0}),e.jsx("label",{className:"text-green-600 ml-2",children:"Low"}),e.jsx("br",{}),e.jsx("input",{className:"mb-4 ml-1 accent-blue-500",type:"radio",name:"task-priority",value:"Medium",checked:t["task-priority"]==="Medium",onChange:a,required:!0}),e.jsx("label",{className:"text-blue-600 ml-2",children:"Medium"}),e.jsx("br",{}),e.jsx("input",{className:"mb-4 ml-1 accent-yellow-700",type:"radio",name:"task-priority",value:"High",checked:t["task-priority"]==="High",onChange:a,required:!0}),e.jsx("label",{className:"text-yellow-500 ml-2",children:"High"}),e.jsx("br",{}),e.jsx("input",{className:"mb-4 ml-1 accent-orange-600",type:"radio",name:"task-priority",value:"Urgent",checked:t["task-priority"]==="Urgent",onChange:a,required:!0}),e.jsx("label",{className:"text-orange-600 ml-2",children:"Urgent"}),e.jsx("br",{}),e.jsx("input",{className:"ml-1 accent-red-500",type:"radio",name:"task-priority",value:"Critical",checked:t["task-priority"]==="Critical",onChange:a,required:!0}),e.jsx("label",{className:"text-red-600 ml-2",children:"Critical"})]}),e.jsx("button",{className:"bg-gray-500 text-white px-4 py-2 rounded mr-4 mt-2",type:"button",onClick:()=>window.history.back(),children:"Cancel"}),e.jsx("button",{className:"bg-blue-500 text-white px-4 py-2 rounded",type:"submit",disabled:m,children:m?"Creating...":"Create Task"})]})]})});export{C as default,w as meta};
