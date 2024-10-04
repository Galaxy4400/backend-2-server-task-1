document.addEventListener('click', event => {
	if (event.target.dataset.type === 'remove') {
		const id = event.target.dataset.id

		remove(id).then(() => {
			event.target.closest('li').remove()
		})
	}

	if (event.target.dataset.type === 'update') {
		const id = event.target.dataset.id

		const curTitle = event.target.closest('li').querySelector('span').innerHTML;

		const newTitle = prompt('Введите новое название', curTitle);

		if (!newTitle) return;

		const data = {
			title: newTitle,
		}

		update(id, data).then(() => {
			event.target.closest('li').querySelector('span').innerHTML = data.title;
		})
	}
})


async function remove(id) {
	await fetch(`/${id}`, { method: 'DELETE' })
}

async function update(id, data) {
	await fetch(`/${id}`, { 
		method: 'PUT', 
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data)
	})
}