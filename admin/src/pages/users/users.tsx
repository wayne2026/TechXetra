import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
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
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="font-medium">{row.original.firstName} {row.original.lastName}</div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
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
            <Badge variant="outline" className="capitalize">{row.getValue("role")}</Badge>
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
                    {isBlocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                    ) : (
                        <Badge variant={isVerified ? "default" : "secondary"}>{isVerified ? "Verified" : "UnVerified"}</Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Joined",
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
            const navigate = useNavigate();
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user?._id)}
                        >
                            Copy User ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate(`/users/user?id=${user?._id}`)}
                        >
                            View Details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const UsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        keyword: "",
        role: "",
        verified: true,
        blocked: false,
    });
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredUsers: 1,
        totalUsers: 1
    });

    const fetchUsers = async (url: string) => {
        try {
            const { data }: { data: AllUsersResponse } = await axios.get(url, { withCredentials: true });
            setUsers(data.users);
            setCounts(prev => ({
                ...prev,
                resultPerPage: data.resultPerPage,
                filteredUsers: data.filteredUsersCount,
                totalUsers: data.count
            }));
        } catch (error: any) {
            toast.error(error.response.data.message);
            setUsers([]);
        }
    }

    useEffect(() => {
        const queryParams = [
            `keyword=${filter.keyword}`,
            `page=${counts.currentPage}`,
            filter.role && `role=${filter.role}`,
            `isVerified=${filter.verified}`,
            `isBlocked=${filter.blocked}`,
        ].filter(Boolean).join("&");

        setLoading(true);

        const delayDebounce = setTimeout(() => {
            const link = `${import.meta.env.VITE_BASE_URL}/admins/users/all?${queryParams}`;
            fetchUsers(link);
            setLoading(false);
        }, 2000);

        return () => clearTimeout(delayDebounce);

    }, [filter, counts.currentPage]);

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="w-full md:w-[90%] mx-auto mt-24 mb-16 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center py-4 px-2">
                <p className="text-2xl font-semibold">All Users ( {filter ? counts.filteredUsers : counts.totalUsers} )</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                <Input
                    placeholder="Search User Email"
                    value={filter.keyword}
                    onChange={(e) => {
                        setFilter({ ...filter, keyword: e.target.value });
                        setCounts({ ...counts, currentPage: 1 });
                    }}
                    className="max-w-sm"
                />
                <div className="flex justify-center items-center space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                        disabled={counts.currentPage === 1}
                    >
                        Prev
                    </Button>
                    <div className="truncate">
                        {counts.currentPage} / {Math.ceil(counts.filteredUsers / counts.resultPerPage)}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                        disabled={counts.currentPage === Math.ceil(counts.filteredUsers / counts.resultPerPage)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap justify-evenly items-center space-y-4 py-6 px-4 md:px-6 xl:px-7.5">
                <div className="inline-flex items-center cursor-pointer gap-4">
                    <select
                        className="text-black px-2 py-1 rounded-md border-2"
                        value={filter.role}
                        onChange={(e) => {
                            setFilter({ ...filter, role: e.target.value });
                            setCounts({ ...counts, currentPage: 1 });
                        }}
                    >
                        <option value="">ALL</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                        <option value="MODERATOR">MODERATOR</option>
                    </select>
                    <label className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Role</label>
                </div>
                <div>
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filter.verified}
                            className="sr-only peer"
                            onChange={() => {
                                setFilter(prev => ({
                                    ...prev,
                                    verified: !prev.verified
                                }));
                                setCounts({ ...counts, currentPage: 1 });
                            }}
                        />
                        <div className="relative border-2 w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Verified</span>
                    </label>
                </div>
                <div>
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filter.blocked}
                            className="sr-only peer"
                            onChange={() => {
                                setFilter(prev => ({
                                    ...prev,
                                    blocked: !prev.blocked
                                }));
                                setCounts({ ...counts, currentPage: 1 });
                            }}
                        />
                        <div className="relative border-2 w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Blocked</span>
                    </label>
                </div>
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
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    onClick={() =>navigate(`/users/user?id=${row.original._id}`)}
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
        </div>
    );
};

export default UsersPage;