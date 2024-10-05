document.addEventListener('click', event => {
	const target = event.target;

	if (target.dataset.type === 'remove') {
		const id = target.dataset.id

		remove(id).then(() => {
			target.closest('li').remove()
		})
	}

	if (target.dataset.type === 'save') {
		const id = target.dataset.id

		const item = target.closest('.list-group-item')

		const newTitle = item.querySelector('input').value;

		if (!newTitle) {
			alert('Введите новое название');
			return;
		}

		const data = {
			title: newTitle,
		}

		update(id, data).then(() => {
			item.querySelector('span').innerHTML = data.title
			item.querySelector('input').value = data.title

			toggleVisibilityActions(target)
		})
	}

	if (target.dataset.type === 'abort') {
		toggleVisibilityActions(target);
	}

	if (target.dataset.type === 'update') {
		toggleVisibilityActions(target);
	}
})


const toggleVisibilityActions = (target) => {
	const item = target.closest('.list-group-item')

	const redact = item.querySelector('[data-type="redact"]');
	const actions = item.querySelector('[data-type="actions"]');

	const span = item.querySelector('span');
	const input = item.querySelector('input');

	redact.classList.toggle('d-none');
	actions.classList.toggle('d-none');
	span.classList.toggle('d-none');
	input.classList.toggle('d-none');
}


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