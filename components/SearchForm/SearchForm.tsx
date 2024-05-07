'use client';
import { useEffect, useState } from 'react';
import classes from './SearchForm.module.css';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import useConfirm from '@/hooks/useConfirm';

export default function SearchForm() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	//TODO update state of searchTerm when the searchTerm is changed exernally

	const [searchTermInput, setSearchTermInput] = useState(
		searchParams.get('searchTerm')?.toString() ?? ''
	);
	const [yearStartInput, setYearStartInput] = useState(
		searchParams.get('yearStart')?.toString() ?? ''
	);
	const [yearEndInput, setYearEndInput] = useState(
		searchParams.get('yearEnd')?.toString() ?? ''
	);

	function handleSearch(params: { param: string; value: string }[]) {
		const urlSearchParams = new URLSearchParams(searchParams);

		params.forEach(({ param, value }) => {
			if (value) {
				urlSearchParams.set(param, value);
			} else {
				urlSearchParams.delete(param);
			}
		});
		urlSearchParams.set('currentPage', '1');

		replace(`${pathname}?${urlSearchParams.toString()}`);
	}

	return (
		<form
			className={classes.searchForm}
			onSubmit={(e) => {
				handleSearch([
					{ param: 'searchTerm', value: searchTermInput },
					{ param: 'yearStart', value: yearStartInput },
					{ param: 'yearEnd', value: yearEndInput },
				]);
				e.preventDefault();
			}}
		>
			<ul>
				<li>
					Use &quot;,&quot; to search for multiple terms, eg.
					&quot;Dinah,Honeysuckle Rose&quot; finds all instances of both songs
				</li>
				<li>
					Use &quot;+&quot; to search for a combination of multiple terms, eg.
					&quot;Fats Waller+Honeysuckle Rose&quot; finds all instances of
					HoneySuckle Rose with Fats Waller
				</li>
			</ul>
			<div className={classes.formElement}>
				<input
					id="searchTerm"
					value={searchTermInput}
					onChange={(e) => setSearchTermInput(e.target.value)}
				/>
			</div>
			{
				<div className={classes.formElement}>
					<label htmlFor="yearStart">Year</label>
					<input
						id="yearStart"
						value={yearStartInput}
						onChange={(e) => setYearStartInput(e.target.value)}
						type="number"
						size={4}
					/>
					<label htmlFor="yearEnd">to</label>
					<input
						id="yearEnd"
						value={yearEndInput}
						onChange={(e) => setYearEndInput(e.target.value)}
						type="number"
						size={4}
					/>
				</div>
			}
			<div className={classes.formElement}>
				<button type="submit">Search</button>
				<button
					className={classes.resetButton}
					type="submit"
					onClick={(e) => {
						//confirmation logic?
						setSearchTermInput('');
						setYearStartInput('');
						setYearEndInput('');
						//e.preventDefault(); // this would reset the form, but not send it
					}}
				>
					Reset
				</button>
			</div>
		</form>
	);
}
