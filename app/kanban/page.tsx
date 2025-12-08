import dynamic from "next/dynamic";

const kanban = dynamic(() => import("@components/kanban"));

export default kanban;
