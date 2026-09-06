import ApplicationManager, { StatusBadge } from "@/pages/ApplicationManager";

export default function Contact() {
  return (
    <ApplicationManager
      title="Contact requests"
      endpoint="/api/admin/contact-submissions"
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        {
          key: "message",
          label: "Message",
          render: (item) => {
            const message = typeof item.message === "string" ? item.message : "";
            return message.length > 60 ? `${message.slice(0, 60)}…` : message || "—";
          },
        },
        {
          key: "status",
          label: "Status",
          render: (item) => <StatusBadge status={item.status} />,
        },
      ]}
    />
  );
}
