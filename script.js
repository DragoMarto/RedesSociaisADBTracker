const form = document.getElementById("entry-form");
const entriesTable = document.getElementById("entries");
const emptyState = document.getElementById("empty-state");
const summary = document.getElementById("summary");

const STORAGE_KEY = "adbtracker-entries";

const formatNumber = (value) =>
  new Intl.NumberFormat("pt-BR").format(value ?? 0);

const formatDelta = (delta) => {
  if (delta === 0) {
    return "0";
  }
  const signal = delta > 0 ? "+" : "";
  return `${signal}${formatNumber(delta)}`;
};

const parseMonthLabel = (value) => {
  if (!value) return "";
  const [year, month] = value.split("-");
  return `${month}/${year}`;
};

const loadEntries = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    return [];
  }
};

const saveEntries = (entries) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

const renderSummary = (entries) => {
  summary.innerHTML = "";
  if (!entries.length) {
    summary.innerHTML = "<p class=\"empty\">Sem dados para resumir.</p>";
    return;
  }

  const latest = entries[entries.length - 1];
  const first = entries[0];
  const totalFacebook = latest.facebook - first.facebook;
  const totalInstagram = latest.instagram - first.instagram;

  const cards = [
    {
      title: "Último mês registrado",
      value: parseMonthLabel(latest.month),
    },
    {
      title: "Facebook (total)",
      value: formatNumber(latest.facebook),
      delta: totalFacebook,
    },
    {
      title: "Instagram (total)",
      value: formatNumber(latest.instagram),
      delta: totalInstagram,
    },
  ];

  cards.forEach((card) => {
    const wrapper = document.createElement("div");
    wrapper.className = "summary-card";
    const deltaClass = card.delta > 0 ? "positive" : card.delta < 0 ? "negative" : "";
    const deltaText =
      card.delta === undefined
        ? ""
        : `<span class=\"delta ${deltaClass}\">${formatDelta(card.delta)}</span>`;

    wrapper.innerHTML = `
      <h3>${card.title}</h3>
      <p>${card.value}</p>
      ${deltaText}
    `;
    summary.appendChild(wrapper);
  });
};

const renderEntries = (entries) => {
  entriesTable.innerHTML = "";
  if (!entries.length) {
    emptyState.style.display = "block";
    renderSummary(entries);
    return;
  }

  emptyState.style.display = "none";

  entries.forEach((entry, index) => {
    const previous = entries[index - 1];
    const facebookDelta = previous ? entry.facebook - previous.facebook : 0;
    const instagramDelta = previous ? entry.instagram - previous.instagram : 0;

    const facebookClass = facebookDelta > 0 ? "positive" : facebookDelta < 0 ? "negative" : "";
    const instagramClass = instagramDelta > 0 ? "positive" : instagramDelta < 0 ? "negative" : "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${parseMonthLabel(entry.month)}</td>
      <td>${formatNumber(entry.facebook)}</td>
      <td class="delta ${facebookClass}">${formatDelta(facebookDelta)}</td>
      <td>${formatNumber(entry.instagram)}</td>
      <td class="delta ${instagramClass}">${formatDelta(instagramDelta)}</td>
      <td>
        <button class="remove" type="button" data-index="${index}">Remover</button>
      </td>
    `;
    entriesTable.appendChild(row);
  });

  renderSummary(entries);
};

const sortEntries = (entries) =>
  entries.sort((a, b) => new Date(a.month) - new Date(b.month));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const month = document.getElementById("month").value;
  const facebook = Number(document.getElementById("facebook").value);
  const instagram = Number(document.getElementById("instagram").value);

  const entries = loadEntries();
  const existingIndex = entries.findIndex((entry) => entry.month === month);

  if (existingIndex >= 0) {
    entries[existingIndex] = { month, facebook, instagram };
  } else {
    entries.push({ month, facebook, instagram });
  }

  saveEntries(sortEntries(entries));
  form.reset();
  renderEntries(loadEntries());
});

entriesTable.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-index]");
  if (!button) return;
  const index = Number(button.dataset.index);
  const entries = loadEntries();
  entries.splice(index, 1);
  saveEntries(entries);
  renderEntries(entries);
});

renderEntries(loadEntries());
