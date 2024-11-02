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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Filter } from "lucide-react";
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

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	phoneNumber: string;
	schoolOrCollege: string;
	schoolName?: string;
	collegeName?: string;
	collegeClass?: string;
	schoolClass?: string;
	isVerified: boolean;
	isBlocked: boolean;
	account: string[];
	createdAt: string;
	updatedAt: string;
};

export const columns: ColumnDef<User>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => (
			<div className="font-medium">
				{row.original.firstName} {row.original.lastName}
			</div>
		),
	},
	{
		accessorKey: "email",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === "asc")
				}
			>
				Email
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("email")}</div>
		),
	},
	{
		accessorKey: "phoneNumber",
		header: "Phone",
		cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => (
			<Badge variant="outline" className="capitalize">
				{row.getValue("role")}
			</Badge>
		),
	},
	{
		accessorKey: "account",
		header: "Account Type",
		cell: ({ row }) => (
			<div className="flex gap-1">
				{(row.getValue("account") as string[]).map((type) => (
					<Badge
						key={type}
						variant="secondary"
						className="capitalize"
					>
						{type.toLowerCase()}
					</Badge>
				))}
			</div>
		),
	},
	{
		accessorKey: "institution",
		header: "Institution",
		cell: ({ row }) => {
			const type = row.original.schoolOrCollege;
			const name =
				type === "SCHOOL"
					? row.original.schoolName
					: row.original.collegeName;
			const className =
				type === "SCHOOL"
					? row.original.schoolClass
					: row.original.collegeClass;

			return (
				<div>
					<div className="font-medium">{name}</div>
					<div className="text-sm text-muted-foreground">
						{type.charAt(0) + type.slice(1).toLowerCase()} -{" "}
						{className}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const isVerified = row.original.isVerified;
			const isBlocked = row.original.isBlocked;

			return (
				<div className="flex gap-2">
					<Badge variant={isVerified ? "default" : "secondary"}>
						{isVerified ? "Verified" : "Unverified"}
					</Badge>
					{isBlocked && <Badge variant="destructive">Blocked</Badge>}
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === "asc")
				}
			>
				Joined
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="text-sm">
				{new Date(row.getValue("createdAt")).toLocaleDateString()}
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const user = row.original;

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
								navigator.clipboard.writeText(user.id)
							}
						>
							Copy User ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View Details</DropdownMenuItem>
						<DropdownMenuItem className="text-destructive">
							{user.isBlocked ? "Unblock User" : "Block User"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

const UsersPage = () => {
	const [data, setData] = React.useState<User[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [totalPages, setTotalPages] = React.useState(0);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(10);
	const [keyword, setKeyword] = React.useState("");
	const [statusFilter, setStatusFilter] = React.useState(""); // For verified/unverified
	const [blockedFilter, setBlockedFilter] = React.useState(""); // For blocked/unblocked
	const [roleFilter, setRoleFilter] = React.useState(""); // For roles

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const fetchUsers = React.useCallback(async () => {
		try {
			setLoading(true);
			const response = await axios.get(
				`http://localhost:8000/api/v1/admins/users/all`,
				{
					params: {
						page: currentPage,
						limit: pageSize,
						keyword: keyword || undefined,
						isVerified:
							statusFilter === "verified"
								? true
								: statusFilter === "unverified"
								? false
								: undefined,
						isBlocked:
							blockedFilter === "blocked"
								? true
								: blockedFilter === "unblocked"
								? false
								: undefined,
						role: roleFilter || undefined,
					},
					withCredentials: true,
				}
			);
			setData(response.data.users);
			setTotalPages(Math.ceil(response.data.total / pageSize));
		} catch (err) {
			setError("Failed to fetch users.");
		} finally {
			setLoading(false);
		}
	}, [
		currentPage,
		pageSize,
		keyword,
		statusFilter,
		blockedFilter,
		roleFilter,
	]);

	React.useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

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

	return (
		<div className="w-full md:w-[90%] mx-auto mt-24 bg-white p-6 rounded-lg shadow-sm">
			<div className="flex items-center py-4 px-2">
				<p className="text-2xl font-semibold">All Users</p>
			</div>
			<div className="flex items-center py-4 gap-4">
				<Input
					placeholder="Search users..."
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
				<Select onValueChange={setStatusFilter}>
					<SelectTrigger>
						<SelectValue placeholder="Select Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Select Status">All</SelectItem>
						<SelectItem value="verified">Verified</SelectItem>
						<SelectItem value="unverified">Unverified</SelectItem>
					</SelectContent>
				</Select>
				<Select onValueChange={setBlockedFilter}>
					<SelectTrigger>
						<SelectValue placeholder="Select Blocked Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Select Blocked Status">
							All
						</SelectItem>
						<SelectItem value="blocked">Blocked</SelectItem>
						<SelectItem value="unblocked">Unblocked</SelectItem>
					</SelectContent>
				</Select>
				<Select onValueChange={setRoleFilter}>
					<SelectTrigger>
						<SelectValue placeholder="Select Role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Select Role">All</SelectItem>
						<SelectItem value="USER">User</SelectItem>
						<SelectItem value="ADMIN">Admin</SelectItem>
						<SelectItem value="MODERATOR">Moderator</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
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
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Previous
				</Button>
				<div className="flex items-center gap-2">
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(
						(page) => (
							<Button
								key={page}
								variant={
									currentPage === page ? "default" : "outline"
								}
								size="sm"
								onClick={() => handlePageChange(page)}
							>
								{page}
							</Button>
						)
					)}
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default UsersPage;
