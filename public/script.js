document.getElementById('saveBtn').addEventListener('click', async () => {
  const text = document.getElementById('entryText').value.trim();
  if (!text) return alert('Please write something!');

  try {
    const res = await fetch('/api/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!res.ok) throw new Error('Failed to save');

    document.getElementById('entryText').value = '';
    await loadEntries();
  } catch (err) {
    console.error(err);
    alert('Error saving entry.');
  }
});

async function loadEntries() {
  try {
    const res = await fetch('/api/entries');
    const entries = await res.json();

    const list = document.getElementById('entriesList');
    list.innerHTML = '';

    entries.reverse().forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.text} — ${new Date(entry.timestamp).toLocaleString()}`;

      // Create and append delete button
      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑️';
      delBtn.className = 'delete-btn';
      delBtn.title = 'Delete entry';
      delBtn.onclick = async (e) => {
        e.stopPropagation();
        if (confirm('Delete this entry?')) {
          const res = await fetch(`/api/entry/${entry.id}`, { method: 'DELETE' });
          if (res.ok) {
            await loadEntries();
          } else {
            alert('Failed to delete entry.');
          }
        }
      };

      li.appendChild(delBtn);
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

document.getElementById('upliftBtn').addEventListener('click', async () => {
  try {
    const res = await fetch('/api/affirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    document.getElementById('affirmation').textContent = data.affirmation;
  } catch (err) {
    console.error(err);
    alert('Failed to get affirmation');
  }
});

window.onload = () => {
  loadEntries();
};
