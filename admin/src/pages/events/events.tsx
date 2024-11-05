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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const columns: ColumnDef<EventDetails>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="font-medium">{row.original.title}</div>
        ),
    },
    {
        accessorKey: "participation",
        header: "Participation",
        cell: ({ row }) => (
            <div className="font-normal">{row.getValue("participation")}</div>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <div className="font-normal">{row.getValue("category")}</div>,
    },
    {
        accessorKey: "limit",
        header: "Limit",
        cell: ({ row }) => (
            <div className="font-normal">{row.getValue("limit")}</div>
        ),
    },
    {
        accessorKey: "registered",
        header: "Registered",
        cell: ({ row }) => (
            <div className="font-normal">{row.getValue("registered")}</div>
        ),
    },
];

const EventsPage = () => {

    const navigate = useNavigate();
    const [events, setEvents] = useState<EventDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        keyword: "",
        participation: "",
        category: ""
    });
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredEvents: 1,
        totalEvents: 1
    });

    const fetchUsers = async (url: string) => {
        try {
            const { data }: { data: AllEventDetailsResponse } = await axios.get(url, { withCredentials: true });
            setEvents(data.events);
            setCounts(prev => ({
                ...prev,
                resultPerPage: data.resultPerPage,
                filteredUsers: data.filteredEventsCount,
                totalUsers: data.count
            }));
        } catch (error: any) {
            toast.error(error.response.data.message);
            setEvents([]);
        }
    }

    useEffect(() => {
        const queryParams = [
            `keyword=${filter.keyword}`,
            `page=${counts.currentPage}`,
            filter.participation && `participation=${filter.participation}`,
            filter.category && `category=${filter.category}`,
        ].filter(Boolean).join("&");

        setLoading(true);

        const delayDebounce = setTimeout(() => {
            const link = `${import.meta.env.VITE_BASE_URL}/events/all?${queryParams}`;
            fetchUsers(link);
            setLoading(false);
        }, 2000);

        return () => clearTimeout(delayDebounce);

    }, [filter, counts.currentPage]);

    const table = useReactTable({
        data: events,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="w-full md:w-[90%] mx-auto mt-24 mb-16 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center py-4 px-2 gap-2">
                <p className="text-2xl font-semibold">All Events ( {filter ? counts.filteredEvents : counts.totalEvents} )</p>
                <Button onClick={() => navigate(`/events/create`)}>Create New Event</Button>
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
                        {counts.currentPage} / {Math.ceil(counts.filteredEvents / counts.resultPerPage)}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                        disabled={counts.currentPage === Math.ceil(counts.filteredEvents / counts.resultPerPage)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap justify-evenly items-center space-y-4 py-6 px-4 md:px-6 xl:px-7.5">
                <div className="inline-flex items-center cursor-pointer gap-4">
                    <select
                        className="text-black px-2 py-1 rounded-md border-2"
                        value={filter.participation}
                        onChange={(e) => {
                            setFilter({ ...filter, participation: e.target.value });
                            setCounts({ ...counts, currentPage: 1 });
                        }}
                    >
                        <option value="">ALL</option>
                        <option value="SOLO">SOLO</option>
                        <option value="TEAM">TEAM</option>
                        <option value="HYBRID">HYBRID</option>
                    </select>
                    <label className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Participation</label>
                </div>
                <div className="inline-flex items-center cursor-pointer gap-4">
                    <select
                        className="text-black px-2 py-1 rounded-md border-2"
                        value={filter.category}
                        onChange={(e) => {
                            setFilter({ ...filter, category: e.target.value });
                            setCounts({ ...counts, currentPage: 1 });
                        }}
                    >
                        <option value="">ALL</option>
                        <option value="TECHNICAL">TECHNICAL</option>
                        <option value="GENERAL">GENERAL</option>
                        <option value="CULTURAL">CULTURAL</option>
                        <option value="SPORTS">SPORTS</option>
                        <option value="ESPORTS">ESPORTS</option>
                        <option value="MISCELLANEOUS">MISCELLANEOUS</option>
                    </select>
                    <label className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Category</label>
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
                                    onClick={() => navigate(`/events/event?id=${row.original._id}`)}
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
    )
}

export default EventsPage;