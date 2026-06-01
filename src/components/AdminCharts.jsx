import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
  } from "recharts";
  
  function AdminCharts({ appointments }) {
    const statusData = [
      { name: "Booked", value: appointments.filter((a) => a.status === "Booked").length },
      { name: "Accepted", value: appointments.filter((a) => a.status === "Accepted").length },
      { name: "Rejected", value: appointments.filter((a) => a.status === "Rejected").length },
      { name: "Completed", value: appointments.filter((a) => a.status === "Completed").length },
    ];
  
    const departmentMap = appointments.reduce((acc, appointment) => {
      const department = appointment.department || "Unknown";
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {});
  
    const departmentData = Object.entries(departmentMap).map(([name, value]) => ({
      name,
      value,
    }));
  
    return (
      <section className="dashboardPanel">
        <h2>Visual Analytics</h2>
  
        <div className="chartsGrid">
          <div className="chartCard">
            <h3>Appointments by Status</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0d6efd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
  
          <div className="chartCard">
            <h3>Appointments by Department</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={departmentData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {departmentData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={["#0d6efd", "#102a43", "#38bdf8", "#22c55e"][index % 4]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    );
  }
  
  export default AdminCharts;