import { useMemo, useState } from "react";
import AdminDashboardStats from "./adminDashboard/AdminDashboardStats";

const DashboardEntityList = ({
  title,
  description,
  stats,
  items,
  emptyMessage,
  searchPlaceholder,
  searchFields,
  sortOptions,
  defaultSortKey,
  defaultSortOrder = "asc",
  rowKey,
  onRowClick,
  renderRow,
  columns,
  exportFilename,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [sortKey, setSortKey] = useState(
    defaultSortKey || sortOptions[0]?.value || "name"
  );

  const [sortOrder, setSortOrder] =
    useState(defaultSortOrder);

  // Pagination State
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;

  // Filter Items
  const filteredItems = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return items;

    return items.filter((item) =>
      searchFields.some((field) =>
        String(item?.[field] || "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [items, searchFields, searchTerm]);

  const visibleItems = useMemo(() => {
    // When user selects "Blocked" (mapped to isActive), show only blocked entries.
    if (sortKey === "isActive") {
      return filteredItems.filter((item) => {
        const isExplicitlyBlocked = item?.isActive === false || item?.active === false;
        const status = String(item?.status || "").toLowerCase();
        const isStatusBlocked = status === "blocked" || status === "inactive";
        return isExplicitlyBlocked || isStatusBlocked;
      });
    }

    // Show only active entries when "Active" is selected.
    if (sortKey === "activeOnly") {
      return filteredItems.filter((item) => {
        const isExplicitlyActive = item?.isActive === true || item?.active === true;
        const status = String(item?.status || "").toLowerCase();
        const isStatusActive = status === "active";
        return isExplicitlyActive || isStatusActive;
      });
    }

    // Complaint status specific filters.
    if (sortKey === "statusSubmitted") {
      return filteredItems.filter((item) => String(item?.status || "").toLowerCase() === "submitted");
    }

    if (sortKey === "statusUnderReview") {
      return filteredItems.filter((item) => String(item?.status || "").toLowerCase() === "under review");
    }

    if (sortKey === "statusInProgress") {
      return filteredItems.filter((item) => {
        const status = String(item?.status || "").toLowerCase();
        return status === "in progress" || status === "inprogress";
      });
    }

    if (sortKey === "statusResolved") {
      return filteredItems.filter((item) => String(item?.status || "").toLowerCase() === "resolved");
    }

    return filteredItems;
  }, [filteredItems, sortKey]);

  // Sort Items
  const sortedItems = useMemo(() => {
    if (sortKey === "all") {
      return [...visibleItems];
    }

    const valueFor = (item) => {
      const raw = item?.[sortKey];

      if (typeof raw === "number") return raw;

      return String(raw || "").toLowerCase();
    };

    return [...visibleItems].sort((a, b) => {
      const aValue = valueFor(a);
      const bValue = valueFor(b);

      if (aValue < bValue)
        return sortOrder === "asc" ? -1 : 1;

      if (aValue > bValue)
        return sortOrder === "asc" ? 1 : -1;

      return 0;
    });
  }, [visibleItems, sortKey, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(
    sortedItems.length / itemsPerPage
  );

  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export CSV
  const exportCSV = () => {
    if (!exportFilename || !columns?.length) return;

    const headers = columns.map(
      (column) => column.label
    );

    const rows = sortedItems.map((item) =>
      columns.map(
        (column) =>
          column.exportValue?.(item) ??
          column.value?.(item) ??
          ""
      )
    );

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) =>
            `"${String(cell).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = exportFilename;

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* Stats */}
        <AdminDashboardStats dashboardStats={stats} />

        {/* Main Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-5">

          {/* Header */}
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Left Side */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {title}
              </h1>

              <p className="text-sm text-slate-500">
                {description}
              </p>
            </div>

            {/* Right Side */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

              {/* Search */}
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Export */}
              {exportFilename ? (
                <button
                  type="button"
                  onClick={exportCSV}
                  className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition whitespace-nowrap"
                >
                  Export
                </button>
              ) : null}
            </div>
          </div>

          {/* Sort Section */}
          <div className="mb-2 flex items-center gap-3 flex-wrap">

            <label className="text-sm text-slate-600">
              Sort by
            </label>

            <select
              value={sortKey}
              onChange={(e) =>
                setSortKey(e.target.value)
              }
              className="text-sm px-3 py-2 border border-slate-200 rounded-md bg-white"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() =>
                setSortOrder((current) =>
                  current === "asc"
                    ? "desc"
                    : "asc"
                )
              }
              className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              {sortOrder === "asc"
                ? "Asc"
                : "Desc"}
            </button>
          </div>

          {/* Empty State */}
          {sortedItems.length === 0 ? (
            <div className="bg-slate-50 rounded-md p-8 text-center border border-slate-100">
              <p className="text-slate-500">
                {emptyMessage}
              </p>
            </div>
          ) : (

            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">

                  {/* Header */}
                  <thead>
                    <tr className="bg-red-100 text-left">
                      {columns.map(
                        (column, index) => (
                          <th
                            key={column.key}
                            className={`px-4 py-3 text-sm font-semibold text-slate-700 ${
                              index === 0
                                ? "rounded-l-md"
                                : ""
                            } ${
                              index ===
                              columns.length - 1
                                ? "rounded-r-md"
                                : ""
                            }`}
                          >
                            {column.label}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody>
                    {paginatedItems.map(
                      (item, index) => (
                        <tr
                          key={rowKey(item, index)}
                          onClick={() =>
                            onRowClick(item)
                          }
                          className="border-b border-slate-100 hover:bg-red-50 transition cursor-pointer"
                        >
                          {renderRow(item)}
                        </tr>
                      )
                    )}
                  </tbody>

                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Left */}
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  {(currentPage - 1) *
                    itemsPerPage +
                    1}{" "}
                  to{" "}
                  {Math.min(
                    currentPage *
                      itemsPerPage,
                    sortedItems.length
                  )}{" "}
                  of {sortedItems.length} entries
                </p>

                {/* Right */}
                <div className="flex items-center gap-2 flex-wrap">

                  {/* Previous */}
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage(
                        (prev) => prev - 1
                      )
                    }
                    className={`px-3 py-2 text-sm rounded-md border ${
                      currentPage === 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: totalPages },
                    (_, index) => (
                      <button
                        key={index + 1}
                        type="button"
                        onClick={() =>
                          setCurrentPage(
                            index + 1
                          )
                        }
                        className={`w-9 h-9 rounded-md text-sm font-medium ${
                          currentPage ===
                          index + 1
                            ? "bg-red-600 text-white"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    type="button"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (prev) => prev + 1
                      )
                    }
                    className={`px-3 py-2 text-sm rounded-md border ${
                      currentPage ===
                      totalPages
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    Next
                  </button>

                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardEntityList;