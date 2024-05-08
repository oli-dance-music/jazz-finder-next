'use server';

import prisma from '@/prisma/db';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

export async function deletePlaylist(prevState: any, formData: FormData) {
	const schema = zfd.formData({
		id: zfd.text(z.string().uuid()),
	});

	const { success, data, error } = schema.safeParse(formData);

	if (!success) {
		console.log(error);
		return {
			message: 'unknown error',
			status: 'data-error',
		};
	}

	await prisma.playlist.delete({
		where: { id: data.id },
	});

	return {
		message: 'Playlist succesfully deleted',
		status: 'success',
	};
}

export async function loadPlaylists() {
	const playlists = await prisma.playlist.findMany({
		//where: { approved: false },
		orderBy: {
			name: 'asc',
		},
	});
	return playlists;
}

/* Wichtig: Wenn das Formular useFormState nutzt, wird formData zum
zweiten Parameter, der erste ist der Startwert von useFormData */
export async function savePlaylist(prevState: any, formData: FormData) {
	const schema = zfd.formData({
		id: zfd.text(z.string().uuid()).optional(),
		created: zfd.text(z.coerce.date()).optional(), //do we need it here?
		updated: zfd.text(z.coerce.date()).optional(), //do we need it here?
		name: zfd.text(z.string().max(100)),
		recordings: zfd.text(z.string()),
		userId: zfd.text(z.string().uuid()),
		public: zfd.checkbox(),
	});

	const { success, data, error } = schema.safeParse(formData);

	if (!success) {
		console.log(error);
		return {
			message: 'Please check your input',
			status: 'data-error',
			playlistId: '',
			//playlist: null,
		};
	}

	const userExists = await prisma.user.findUnique({
		where: {
			id: data.userId,
		},
	});

	if (!userExists) {
		return {
			message: 'User is not existing',
			status: 'data-error',
			playlistId: data.id,
			//playlist: data,
		};
	}

	const playlistExists = data.id
		? await prisma.playlist.findUnique({
				where: {
					id: data.id,
				},
		  })
		: null;

	if (!playlistExists) {
		const savePlaylist = await prisma.playlist.create({
			data: {
				name: data.name,
				recordings: data.recordings,
				userId: data.userId,
				public: data.public,
			},
		});
		data.id = savePlaylist.id;
		data.recordings = data.recordings;
	} else {
		await prisma.playlist.update({
			where: {
				id: data.id,
			},
			data: {
				name: data.name,
				recordings: data.recordings,
				public: data.public,
			},
		});
	}

	//revalidatePath('/signatures');

	return {
		message: 'Playlist saved succesfully',
		status: 'success',
		playlistId: data.id,
		//playlist: data,
	};
}
