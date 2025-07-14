export default function MailApp() {
  const emails = [
    { subject: "欢迎使用邮件", sender: "Apple Support", time: "9:30 AM" },
    { subject: "新功能介绍", sender: "产品团队", time: "昨天" },
    { subject: "系统更新通知", sender: "系统管理员", time: "2天前" },
    { subject: "会议邀请", sender: "张三", time: "3天前" },
  ];

  return (
    <div className="text-sm">
      <h3 className="font-bold mb-2">邮件</h3>
      <div className="space-y-2">
        {emails.map((email, index) => (
          <div key={index} className="border-b pb-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium">{email.subject}</div>
                <div className="text-xs text-gray-500">{email.sender}</div>
              </div>
              <div className="text-xs text-gray-400">{email.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
