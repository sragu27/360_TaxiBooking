// 🔐 Protect page
if (localStorage.getItem("admin") !== "true") {
  window.location.href = "admin-login.html";
}

const supabase = window.supabase.createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY
);

function getStatusBadge(status) {
  if (status === "completed") return `<span class="badge bg-success">Completed</span>`;
  if (status === "cancelled") return `<span class="badge bg-danger">Cancelled</span>`;
  return `<span class="badge bg-warning text-dark">Pending</span>`;
}

async function loadBookings() {
  const search = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("filter").value;

  let query = supabase.from("bookings").select("*");

  if (filter) query = query.eq("status", filter);

  const { data } = await query.order("id", { ascending: false });

  const table = document.getElementById("table");
  table.innerHTML = "";

  data
    .filter(b => b.name.toLowerCase().includes(search))
    .forEach(b => {
      table.innerHTML += `
        <tr>
          <td><b>${b.name}</b></td>
          <td>${b.phone}</td>
          <td>${b.pickup} → ${b.drop_location}</td>
          <td>${b.date}</td>
          <td>${getStatusBadge(b.status)}</td>
          <td>
            <button class="btn btn-sm btn-success" onclick="updateStatus(${b.id}, 'completed')">✔</button>
            <button class="btn btn-sm btn-danger" onclick="updateStatus(${b.id}, 'cancelled')">✖</button>
          </td>
        </tr>
      `;
    });
}

async function updateStatus(id, status) {
  await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  loadBookings();
}

function logout() {
  localStorage.removeItem("admin");
  window.location.href = "admin-login.html";
}

loadBookings();