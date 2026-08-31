import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  LogOut,
  Plus,
  Trash2,
  Users,
  TrendingUp,
  UserRoundPlus,
  NotebookPen,
  Clock3,
  X
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import styles from "./AdminDashboard.module.css";

const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "viewing",
  "negotiation",
  "won",
  "lost"
];

const appointmentStatuses = [
  "pending",
  "confirmed",
  "completed",
  "cancelled"
];

const followUpStatuses = [
  "scheduled",
  "completed",
  "missed",
  "cancelled"
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [followUp, setFollowUp] = useState({
    date: "",
    note: ""
  });

  const [agentForm, setAgentForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [editing, setEditing] = useState(null);

  const emptyPropertyForm = {
    title: "",
    type: "apartment",
    purpose: "sale",
    city: "",
    area: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    sizeSqm: "",
    description: "",
    amenities: "",
    images: "",
    featured: false,
    status: "available"
  };

  const [form, setForm] = useState(emptyPropertyForm);

  const money = useMemo(
    () => new Intl.NumberFormat("en-EG", {
      maximumFractionDigits: 0
    }),
    []
  );

  async function refresh() {
    const requests = [
      api.get("/stats"),
      api.get("/properties", {
        params: {
          status: "",
          limit: 50
        }
      }),
      api.get("/leads")
    ];

    if (isAdmin) {
      requests.push(api.get("/appointments"));
      requests.push(api.get("/agents"));
    }

    const result = await Promise.all(requests);

    setStats(result[0].data);
    setProperties(result[1].data.items || []);
    setLeads(result[2].data.items || []);

    if (isAdmin) {
      setAppointments(result[3].data.items || []);
      setAgents(result[4].data.items || []);
    }

    if (selectedLead) {
      const current = (result[2].data.items || [])
        .find(item => item._id === selectedLead._id);

      if (current) {
        setSelectedLead(current);
      }
    }
  }

  useEffect(() => {
    refresh();
  }, [isAdmin]);

  function resetForm() {
    setEditing(null);
    setForm(emptyPropertyForm);
  }

  function editProperty(property) {
    setEditing(property._id);

    setForm({
      ...property,
      amenities: (property.amenities || []).join(", "),
      images: (property.images || []).join(", ")
    });

    setTab("property-form");
  }

  async function saveProperty(e) {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms || 0),
      bathrooms: Number(form.bathrooms || 0),
      sizeSqm: Number(form.sizeSqm),
      amenities: String(form.amenities || "")
        .split(",")
        .map(item => item.trim())
        .filter(Boolean),
      images: String(form.images || "")
        .split(",")
        .map(item => item.trim())
        .filter(Boolean)
    };

    if (editing) {
      await api.put(`/properties/${editing}`, payload);
    } else {
      await api.post("/properties", payload);
    }

    resetForm();
    setTab("properties");
    refresh();
  }

  async function removeProperty(id) {
    if (!window.confirm("Delete this property?")) return;

    await api.delete(`/properties/${id}`);
    refresh();
  }

  async function leadStatus(id, status) {
    const { data } = await api.patch(
      `/leads/${id}/status`,
      { status }
    );

    if (selectedLead?._id === id) {
      setSelectedLead(data.lead);
    }

    refresh();
  }

  async function assignLead(id, agentId) {
    const { data } = await api.patch(
      `/leads/${id}/assign`,
      { agentId: agentId || null }
    );

    if (selectedLead?._id === id) {
      setSelectedLead(data.lead);
    }

    refresh();
  }

  async function addNote(e) {
    e.preventDefault();

    if (!noteText.trim() || !selectedLead) return;

    const { data } = await api.post(
      `/leads/${selectedLead._id}/notes`,
      { text: noteText }
    );

    setSelectedLead(data.lead);
    setNoteText("");
    refresh();
  }

  async function addFollowUp(e) {
    e.preventDefault();

    if (!followUp.date || !selectedLead) return;

    const { data } = await api.post(
      `/leads/${selectedLead._id}/follow-ups`,
      followUp
    );

    setSelectedLead(data.lead);

    setFollowUp({
      date: "",
      note: ""
    });

    refresh();
  }

  async function updateFollowUpStatus(followUpId, status) {
    const { data } = await api.patch(
      `/leads/${selectedLead._id}/follow-ups/${followUpId}`,
      { status }
    );

    setSelectedLead(data.lead);
    refresh();
  }

  async function appointmentStatus(id, status) {
    await api.patch(
      `/appointments/${id}/status`,
      { status }
    );

    refresh();
  }

  async function createAgent(e) {
    e.preventDefault();

    await api.post("/agents", agentForm);

    setAgentForm({
      name: "",
      email: "",
      phone: "",
      password: ""
    });

    refresh();
  }

  async function toggleAgent(agent) {
    await api.patch(
      `/agents/${agent._id}`,
      { active: !agent.active }
    );

    refresh();
  }

  const tabs = isAdmin
    ? ["overview", "properties", "leads", "agents", "appointments"]
    : ["overview", "leads"];

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <Building2 size={20} />
          </span>
          HELD REAL ESTATE
        </div>

        <div className={styles.user}>
          {isAdmin ? "Administrator" : "Sales Agent"}
          <br />
          <strong>{user?.name}</strong>
        </div>

        <nav>
          {tabs.map(item => (
            <button
              key={item}
              className={tab === item ? styles.active : ""}
              onClick={() => setTab(item)}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>

        <button
          className={styles.logout}
          onClick={logout}
        >
          <LogOut size={17} />
          Logout
        </button>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <span className={styles.eyebrow}>
              {isAdmin
                ? "ADMIN DASHBOARD"
                : "SALES WORKSPACE"}
            </span>

            <h1>
              {tab === "property-form"
                ? editing
                  ? "Edit property"
                  : "Add property"
                : tab[0].toUpperCase() + tab.slice(1)}
            </h1>
          </div>
        </div>

        {tab === "overview" && (
          <>
            <div className={styles.kpis}>
              {[
                [
                  isAdmin ? "Properties" : "Assigned leads",
                  isAdmin ? stats.properties : stats.leads,
                  isAdmin ? Building2 : Users
                ],
                ["All leads", stats.leads, Users],
                ["New leads", stats.newLeads, TrendingUp],
                [
                  isAdmin ? "Open appointments" : "Won leads",
                  isAdmin ? stats.appointments : stats.wonLeads,
                  CalendarDays
                ]
              ].map(([label, value, Icon]) => (
                <div
                  className={styles.kpi}
                  key={label}
                >
                  <span>
                    <Icon size={20} />
                  </span>

                  <div>
                    <small>{label}</small>
                    <strong>{value ?? 0}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.panel}>
              <h3>
                {isAdmin
                  ? "Sales snapshot"
                  : "Your pipeline"}
              </h3>

              <p>
                Won leads:
                {" "}
                <strong>{stats.wonLeads ?? 0}</strong>
              </p>

              <p>
                Lead conversion rate:
                {" "}
                <strong>{stats.conversionRate ?? 0}%</strong>
              </p>
            </div>
          </>
        )}

        {isAdmin && tab === "properties" && (
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h3>Property inventory</h3>

              <button
                className="btn btn-sm"
                onClick={() => {
                  resetForm();
                  setTab("property-form");
                }}
              >
                <Plus size={16} />
                Add property
              </button>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {properties.map(property => (
                    <tr key={property._id}>
                      <td>
                        <strong>{property.title}</strong>
                        <br />
                        <small>{property.type}</small>
                      </td>

                      <td>
                        {property.area}, {property.city}
                      </td>

                      <td>
                        EGP {money.format(property.price)}
                      </td>

                      <td>
                        <span
                          className={`
                            ${styles.status}
                            ${styles[property.status]}
                          `}
                        >
                          {property.status}
                        </span>
                      </td>

                      <td className={styles.rowActions}>
                        <button
                          onClick={() => editProperty(property)}
                        >
                          Edit
                        </button>

                        <button
                          className={styles.danger}
                          onClick={() => removeProperty(property._id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isAdmin && tab === "property-form" && (
          <form
            className={`${styles.panel} ${styles.form}`}
            onSubmit={saveProperty}
          >
            <div className={styles.formGrid}>
              <label>
                Title
                <input
                  value={form.title}
                  onChange={e => setForm({
                    ...form,
                    title: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Type
                <select
                  value={form.type}
                  onChange={e => setForm({
                    ...form,
                    type: e.target.value
                  })}
                >
                  {[
                    "apartment",
                    "villa",
                    "townhouse",
                    "office",
                    "commercial",
                    "chalet",
                    "land"
                  ].map(item => (
                    <option key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Purpose
                <select
                  value={form.purpose}
                  onChange={e => setForm({
                    ...form,
                    purpose: e.target.value
                  })}
                >
                  <option value="sale">sale</option>
                  <option value="rent">rent</option>
                </select>
              </label>

              <label>
                City
                <input
                  value={form.city}
                  onChange={e => setForm({
                    ...form,
                    city: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Area
                <input
                  value={form.area}
                  onChange={e => setForm({
                    ...form,
                    area: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Price
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm({
                    ...form,
                    price: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Bedrooms
                <input
                  type="number"
                  value={form.bedrooms}
                  onChange={e => setForm({
                    ...form,
                    bedrooms: e.target.value
                  })}
                />
              </label>

              <label>
                Bathrooms
                <input
                  type="number"
                  value={form.bathrooms}
                  onChange={e => setForm({
                    ...form,
                    bathrooms: e.target.value
                  })}
                />
              </label>

              <label>
                Size m²
                <input
                  type="number"
                  value={form.sizeSqm}
                  onChange={e => setForm({
                    ...form,
                    sizeSqm: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={e => setForm({
                    ...form,
                    status: e.target.value
                  })}
                >
                  <option>available</option>
                  <option>reserved</option>
                  <option>sold</option>
                </select>
              </label>
            </div>

            <label>
              Description
              <textarea
                rows="5"
                value={form.description}
                onChange={e => setForm({
                  ...form,
                  description: e.target.value
                })}
                required
              />
            </label>

            <label>
              Amenities (comma separated)
              <input
                value={form.amenities}
                onChange={e => setForm({
                  ...form,
                  amenities: e.target.value
                })}
              />
            </label>

            <label>
              Image URLs (comma separated)
              <input
                value={form.images}
                onChange={e => setForm({
                  ...form,
                  images: e.target.value
                })}
              />
            </label>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm({
                  ...form,
                  featured: e.target.checked
                })}
              />
              Featured property
            </label>

            <div className={styles.formActions}>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setTab("properties")}
              >
                Cancel
              </button>

              <button className="btn">
                {editing
                  ? "Save changes"
                  : "Create property"}
              </button>
            </div>
          </form>
        )}

        {tab === "leads" && (
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <div>
                <h3>
                  {isAdmin
                    ? "Lead distribution & pipeline"
                    : "My assigned leads"}
                </h3>

                <p className={styles.panelSub}>
                  Open any lead to manage notes and follow-ups.
                </p>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Property</th>
                    <th>Contact</th>
                    {isAdmin && <th>Sales Agent</th>}
                    <th>Status</th>
                    <th>Next Follow-up</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map(lead => {
                    const nextFollowUp = (lead.followUps || [])
                      .filter(item => item.status === "scheduled")
                      .sort(
                        (a, b) =>
                          new Date(a.date) - new Date(b.date)
                      )[0];

                    return (
                      <tr key={lead._id}>
                        <td>
                          <strong>{lead.name}</strong>
                          <br />
                          <small>
                            {lead.message || "No message"}
                          </small>
                        </td>

                        <td>
                          {lead.property?.title || "General inquiry"}
                        </td>

                        <td>
                          {lead.phone}
                          <br />
                          <small>{lead.email}</small>
                        </td>

                        {isAdmin && (
                          <td>
                            <select
                              className={styles.select}
                              value={lead.assignedTo?._id || ""}
                              onChange={e => assignLead(
                                lead._id,
                                e.target.value
                              )}
                            >
                              <option value="">
                                Unassigned
                              </option>

                              {agents
                                .filter(agent => agent.active)
                                .map(agent => (
                                  <option
                                    key={agent._id}
                                    value={agent._id}
                                  >
                                    {agent.name}
                                  </option>
                                ))}
                            </select>
                          </td>
                        )}

                        <td>
                          <select
                            className={styles.select}
                            value={lead.status}
                            onChange={e => leadStatus(
                              lead._id,
                              e.target.value
                            )}
                          >
                            {leadStatuses.map(status => (
                              <option key={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          {nextFollowUp
                            ? new Date(
                                nextFollowUp.date
                              ).toLocaleString()
                            : "—"}
                        </td>

                        <td>
                          <button
                            className={styles.tableAction}
                            onClick={() => setSelectedLead(lead)}
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isAdmin && tab === "agents" && (
          <div className={styles.agentsLayout}>
            <form
              className={`${styles.panel} ${styles.form}`}
              onSubmit={createAgent}
            >
              <div className={styles.panelHead}>
                <h3>Add sales agent</h3>
                <UserRoundPlus size={20} />
              </div>

              <label>
                Name
                <input
                  value={agentForm.name}
                  onChange={e => setAgentForm({
                    ...agentForm,
                    name: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={agentForm.email}
                  onChange={e => setAgentForm({
                    ...agentForm,
                    email: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Phone
                <input
                  value={agentForm.phone}
                  onChange={e => setAgentForm({
                    ...agentForm,
                    phone: e.target.value
                  })}
                />
              </label>

              <label>
                Temporary password
                <input
                  type="password"
                  value={agentForm.password}
                  onChange={e => setAgentForm({
                    ...agentForm,
                    password: e.target.value
                  })}
                  minLength="8"
                  required
                />
              </label>

              <button className="btn full">
                Create agent
              </button>
            </form>

            <div className={styles.panel}>
              <h3>Sales team</h3>

              <div className={styles.agentCards}>
                {agents.map(agent => (
                  <div
                    className={styles.agentCard}
                    key={agent._id}
                  >
                    <div>
                      <strong>{agent.name}</strong>
                      <small>{agent.email}</small>
                      <small>
                        {agent.phone || "No phone"}
                      </small>
                    </div>

                    <button
                      className={`
                        ${styles.agentToggle}
                        ${agent.active
                          ? styles.agentToggleActive
                          : ""}
                      `}
                      onClick={() => toggleAgent(agent)}
                    >
                      {agent.active
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isAdmin && tab === "appointments" && (
          <div className={styles.panel}>
            <h3>Viewing appointments</h3>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Property</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map(item => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.name}</strong>
                        <br />
                        <small>{item.phone}</small>
                      </td>

                      <td>
                        {item.property?.title}
                      </td>

                      <td>
                        {new Date(
                          item.preferredDate
                        ).toLocaleString()}
                      </td>

                      <td>
                        <select
                          className={styles.select}
                          value={item.status}
                          onChange={e => appointmentStatus(
                            item._id,
                            e.target.value
                          )}
                        >
                          {appointmentStatuses.map(status => (
                            <option key={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {selectedLead && (
        <div
          className={styles.drawerBackdrop}
          onClick={() => setSelectedLead(null)}
        >
          <aside
            className={styles.drawer}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.drawerHead}>
              <div>
                <span className={styles.eyebrow}>
                  LEAD WORKSPACE
                </span>

                <h2>{selectedLead.name}</h2>

                <p>
                  {selectedLead.phone}
                  {selectedLead.email
                    ? ` • ${selectedLead.email}`
                    : ""}
                </p>
              </div>

              <button
                className={styles.iconButton}
                onClick={() => setSelectedLead(null)}
              >
                <X />
              </button>
            </div>

            <div className={styles.leadSummary}>
              <span>
                <strong>Property</strong>
                {selectedLead.property?.title
                  || "General inquiry"}
              </span>

              <span>
                <strong>Status</strong>
                {selectedLead.status}
              </span>

              <span>
                <strong>Assigned to</strong>
                {selectedLead.assignedTo?.name
                  || "Unassigned"}
              </span>
            </div>

            <section className={styles.drawerSection}>
              <div className={styles.drawerTitle}>
                <NotebookPen size={18} />
                <h3>Notes</h3>
              </div>

              <form
                className={styles.drawerForm}
                onSubmit={addNote}
              >
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Add call result, preference, objection, budget..."
                />

                <button className="btn btn-sm">
                  Add note
                </button>
              </form>

              <div className={styles.timeline}>
                {[...(selectedLead.notes || [])]
                  .reverse()
                  .map(note => (
                    <div
                      className={styles.timelineItem}
                      key={note._id}
                    >
                      <strong>
                        {note.createdBy?.name
                          || "Team member"}
                      </strong>

                      <p>{note.text}</p>

                      <small>
                        {new Date(
                          note.createdAt
                        ).toLocaleString()}
                      </small>
                    </div>
                  ))}

                {!selectedLead.notes?.length && (
                  <p className={styles.mutedSmall}>
                    No notes yet.
                  </p>
                )}
              </div>
            </section>

            <section className={styles.drawerSection}>
              <div className={styles.drawerTitle}>
                <Clock3 size={18} />
                <h3>Follow-ups</h3>
              </div>

              <form
                className={styles.drawerForm}
                onSubmit={addFollowUp}
              >
                <input
                  type="datetime-local"
                  value={followUp.date}
                  onChange={e => setFollowUp({
                    ...followUp,
                    date: e.target.value
                  })}
                  required
                />

                <input
                  value={followUp.note}
                  onChange={e => setFollowUp({
                    ...followUp,
                    note: e.target.value
                  })}
                  placeholder="Purpose of follow-up"
                />

                <button className="btn btn-sm">
                  Schedule follow-up
                </button>
              </form>

              <div className={styles.followupList}>
                {[...(selectedLead.followUps || [])]
                  .sort(
                    (a, b) =>
                      new Date(a.date) - new Date(b.date)
                  )
                  .map(item => (
                    <div
                      className={styles.followupCard}
                      key={item._id}
                    >
                      <div>
                        <strong>
                          {new Date(
                            item.date
                          ).toLocaleString()}
                        </strong>

                        <p>
                          {item.note
                            || "Follow up with the customer"}
                        </p>

                        <small>
                          Created by
                          {" "}
                          {item.createdBy?.name
                            || "Team member"}
                        </small>
                      </div>

                      <select
                        className={styles.select}
                        value={item.status}
                        onChange={e => updateFollowUpStatus(
                          item._id,
                          e.target.value
                        )}
                      >
                        {followUpStatuses.map(status => (
                          <option key={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                {!selectedLead.followUps?.length && (
                  <p className={styles.mutedSmall}>
                    No follow-ups scheduled yet.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
