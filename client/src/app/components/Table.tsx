import { useState } from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import { Pagination, PaginationProps } from "@cloudscape-design/components";

const DEFAULT_PREFERENCES = {
  pageSize: 30,
  visibleContent: ["domainName", "deliveryMethod", "state"],
};

const paginationAriaLabels: (totalPages?: number) => PaginationProps.Labels = (
  totalPages
) => ({
  nextPageLabel: "Next page",
  previousPageLabel: "Previous page",
  pageLabel: (pageNumber) =>
    `Page ${pageNumber} of ${totalPages || "all pages"}`,
});

export default function TableOutput({ data }: any) {
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const { column_names, results } = data;

  // generating columnDefinitions from column names
  const columnDefinitions = column_names.map((name: any) => ({
    id: name,
    header: name.charAt(0).toUpperCase() + name.slice(1), // Capitalizing the first letter
    cell: (item: any) => item[name] || "-",
    sortingField: name,
  }));

  return (
    <Table
      columnDefinitions={columnDefinitions}
      items={results}
      loadingText="Loading resources"
      stripedRows
      variant="embedded"
      //   pagination={
      //     <Pagination
      //       currentPageIndex={currentPageIndex}
      //       onChange={({ detail }) =>
      //         setCurrentPageIndex(detail.currentPageIndex)
      //       }
      //       pagesCount={3}
      //     />
      //   }
      empty={
        <Box textAlign="center" color="inherit">
          <b>No resources</b>
          <Box padding={{ bottom: "s" }} variant="p" color="inherit">
            No resources to display.
          </Box>
          <Button>Create resource</Button>
        </Box>
      }
    />
  );
}
