const repositoryList = document.querySelector("#repositories");
const statusMessage = document.querySelector("#status");

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

function createRepositoryCard(repository) {
  const item = document.createElement("li");
  item.className = "repo-card";

  const heading = document.createElement("div");
  heading.className = "repo-heading";

  const link = document.createElement("a");
  link.className = "repo-name";
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repository.name;

  const path = document.createElement("span");
  path.className = "repo-path";
  path.textContent = repository.repository;
  heading.append(link, path);

  const description = document.createElement("p");
  description.className = "repo-description";
  description.textContent = repository.description;

  const meta = document.createElement("div");
  meta.className = "repo-meta";

  const language = document.createElement("span");
  language.className = "repo-language";
  language.textContent = repository.language || "Language not specified";

  const date = document.createElement("time");
  date.className = "repo-date";
  date.dateTime = repository.starredAt;
  date.textContent = `Starred ${formatDate(repository.starredAt)}`;
  meta.append(language, date);

  item.append(heading, description, meta);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();

    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    repositoryList.replaceChildren(...repositories.map(createRepositoryCard));
    statusMessage.hidden = repositories.length > 0;
    statusMessage.textContent = repositories.length
      ? ""
      : "No starred repositories yet.";
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    statusMessage.textContent = "Could not load repositories. Please try again later.";
  }
}

loadRepositories();
