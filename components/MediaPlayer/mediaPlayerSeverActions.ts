'use server';

import prisma from '@/prisma/db';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

/**
 * Deletes a playlist from the server.
 *
 * @param {any} prevState - The previous state of the playlist.
 * @param {FormData} formData - The form data containing the playlist ID.
 * @return {Promise<{message: string, status: string}>} - A promise that resolves to an object with a message and status indicating the result of the deletion.
 */
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

/**
 * Loads playlists from the server.
 *
 * @return {Promise<Playlist[]>} The playlists loaded from the server.
 */
export async function loadPlaylists() {
	const playlists = await prisma.playlist.findMany({
		//where: { approved: false },
		orderBy: {
			name: 'asc',
		},
	});
	return playlists;
}

/**
 * Saves a playlist to the server.
 *
 * @param {any} prevState - The previous state of the playlist.
 * @param {FormData} formData - The form data containing the playlist details.
 * @return {Promise<Object>} A promise that resolves to an object with a message, status, and playlist ID.
 */
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

	console.log(formData);

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
