'use client';
import classes from './Pagination.module.css';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type Props = {
	totalResults: number;
	pageSize: number;
	currentPage: number;
};
/**
 * Renders a pagination component that allows the user to navigate through a list of items.
 *
 * @param {Props} props - The properties for the component.
 * @param {number} props.totalResults - The total number of items in the list.
 * @param {number} props.pageSize - The number of items to display per page.
 * @param {number} props.currentPage - The current page number.
 * @return {JSX.Element} The pagination component.
 */
export default function Pagination({
	totalResults,
	pageSize,
	currentPage,
}: Props) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	//const [search, searchDispatch] = useSearchContext()!;
	//const { currentPage } = search;

	//calculate total number of pages
	const totalPages = Math.ceil(totalResults / pageSize);

	/**
	 * Set the current page to the specified value.
	 *
	 * @param {number} value - The value to set as the current page.
	 */
	function setCurrentPage(value: number) {
		const urlSearchParams = new URLSearchParams(searchParams);

		if (value) {
			urlSearchParams.set('currentPage', value.toString());
		} else {
			urlSearchParams.delete('currentPage');
		}

		replace(`${pathname}?${urlSearchParams.toString()}`);
	}

	return (
		<>
			<div className={classes.filterStatus}>
				Found {totalResults} items, showing {pageSize} per page:
			</div>
			<div className={classes.pagination}>
				<button
					onClick={() => setCurrentPage(1)}
					disabled={currentPage == 1 ? true : false}
				>
					{'|<'}
				</button>
				<button
					onClick={() => setCurrentPage(currentPage - 1)}
					disabled={currentPage == 1 ? true : false}
				>
					{'<'}
				</button>
				<span className={classes.currentPage}>
					Page {currentPage} of {totalPages}
				</span>
				<button
					onClick={() => setCurrentPage(currentPage + 1)}
					disabled={currentPage == totalPages ? true : false}
				>
					{'>'}
				</button>
				<button
					onClick={() => setCurrentPage(totalPages)}
					disabled={currentPage == totalPages ? true : false}
				>
					{'>|'}
				</button>
			</div>
		</>
	);
}
