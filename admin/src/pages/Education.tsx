import ApplicationManager, { StatusBadge } from "@/pages/ApplicationManager";

export default function Education() {
  return (
    <ApplicationManager
      title="Education applications"
      endpoint="/api/admin/education-applications"
      columns={[
        { key: "completeName", label: "Name" },
        { key: "email", label: "Email" },
        { key: "telegramOrWhatsapp", label: "Contact" },
        {
          key: "status",
          label: "Status",
          render: (item) => <StatusBadge status={item.status} />,
        },
      ]}
    />
  );
}
