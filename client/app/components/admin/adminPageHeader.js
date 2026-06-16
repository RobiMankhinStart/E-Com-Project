export default function AdminPageHeader({ title, description, action }) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            {title}
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl">{description}</p>
        </div>

        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </section>
  );
}
