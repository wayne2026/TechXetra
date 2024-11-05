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

const RegisteredEvents = () => {

    const navigate = useNavigate();
    const [events, setEvents] = useState<EventDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const fetchUsers = async (url: string) => {
        try {
            const { data }: { data: AllEventDetailsResponse } = await axios.get(url, { withCredentials: true });
            setEvents(data.events);
            setCount(data.count);
        } catch (error: any) {
            toast.error(error.response.data.message);
            setEvents([]);
        }
    }

    useEffect(() => {
        setLoading(true);

        const delayDebounce = setTimeout(() => {
            const link = `${import.meta.env.VITE_BASE_URL}/admins/events/regi`;
            fetchUsers(link);
            setLoading(false);
        }, 2000);

        return () => clearTimeout(delayDebounce);
    }, []);

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
            <p className="text-2xl font-semibold">Registered Events ( {count} )</p>
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

export default RegisteredEvents;