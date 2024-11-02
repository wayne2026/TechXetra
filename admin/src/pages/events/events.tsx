import * as React from "react";
import axios from "axios";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type Event = {
	id: string;
	title: string;
	subTitle?: string;
	note?: string;
	description: string;
	category: string;
	participation: string;
	maxGroup?: number;
	isVisible: boolean;
	canRegister: boolean;
	externalRegistration: boolean;
	extrenalRegistrationLink?: string;
	externalLink?: string;
	registrationRequired: boolean;
	paymentRequired: boolean;
	amount?: number;
	eventDate: string;
	venue?: string;
	deadline?: string;
	image?: string;
	rules?: string[];
	backgroundImage?: string;
	createdAt: string;
	updatedAt: string;
};

export const columns: ColumnDef<Event>[] = [
	{
		accessorKey: "title",
		header: "Title",
		cell: ({ row }) => (
			<div className="font-medium">{row.getValue("title")}</div>
		),
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => (
			<div className="text-sm">{row.getValue("description")}</div>
		),
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }) => (
			<Badge variant="outline" className="capitalize">
				{row.getValue("category")}
			</Badge>
		),
	},
	{
		accessorKey: "participation",
		header: "Participation",
		cell: ({ row }) => (
			<Badge variant="secondary" className="capitalize">
				{row.getValue("participation")}
			</Badge>
		),
	},
	{
		accessorKey: "eventDate",
		header: "Date",
		cell: ({ row }) => (
			<div className="text-sm">
				{new Date(row.getValue("eventDate")).toLocaleDateString()}
			</div>
		),
	},
	{
		accessorKey: "venue",
		header: "Venue",
		cell: ({ row }) => <div>{row.getValue("venue")}</div>,
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const isVisible = row.original.isVisible;
			const canRegister = row.original.canRegister;

			return (
				<div className="flex gap-2">
					<Badge variant={isVisible ? "default" : "secondary"}>
						{isVisible ? "Visible" : "Hidden"}
					</Badge>
					<Badge variant={canRegister ? "default" : "secondary"}>
						{canRegister ? "Registration Open" : "Closed"}
					</Badge>
				</div>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const event = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(event.id)
							}
						>
							Copy Event ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View Details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

const EventsPage = () => {
	const [data, setData] = React.useState<Event[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [totalPages, setTotalPages] = React.useState(0);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(10);
	const [keyword, setKeyword] = React.useState("");

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const fetchEvents = React.useCallback(async () => {
		try {
			setLoading(true);
			const response = await axios.get(
				`http://localhost:8000/api/v1/events/all`,
				{
					params: {
						page: currentPage,
						limit: pageSize,
						keyword: keyword || undefined,
					},
					withCredentials: true,
				}
			);
			setData(response.data.events);
			setTotalPages(Math.ceil(response.data.total / pageSize));
		} catch (err) {
			setError("Failed to fetch events.");
		} finally {
			setLoading(false);
		}
	}, [currentPage, pageSize, keyword]);

	React.useEffect(() => {
		fetchEvents();
	}, [fetchEvents]);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const handlePageSizeChange = (value: string) => {
		setPageSize(Number(value));
		setCurrentPage(1);
	};

	if (loading)
		return (
			<div className="flex items-center justify-center h-screen">
				Loading...
			</div>
		);
	if (error)
		return (
			<div className="flex items-center justify-center h-screen text-red-500">
				{error}
			</div>
		);

	return (
		<div className="w-full md:w-[90%] mx-auto mt-24 bg-white p-6 rounded-lg shadow-sm">
			<div className="flex items-center py-4 px-2">
				<p className="text-2xl font-semibold">All Events</p>
			</div>
			<div className="flex items-center py-4 gap-4">
				<Input
					placeholder="Search events..."
					value={keyword}
					onChange={(event) => setKeyword(event.target.value)}
					className="max-w-sm"
				/>
				<Select
					value={pageSize.toString()}
					onValueChange={handlePageSizeChange}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select page size" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="5">5 per page</SelectItem>
						<SelectItem value="10">10 per page</SelectItem>
						<SelectItem value="20">20 per page</SelectItem>
						<SelectItem value="50">50 per page</SelectItem>
					</SelectContent>
				</Select>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex justify-between items-center mt-4">
				<Button
					disabled={currentPage === 1}
					onClick={() => handlePageChange(currentPage - 1)}
				>
					Previous
				</Button>
				<span className="text-sm text-gray-500">
					Page {currentPage} of {totalPages}
				</span>
				<Button
					disabled={currentPage === totalPages}
					onClick={() => handlePageChange(currentPage + 1)}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default EventsPage;
