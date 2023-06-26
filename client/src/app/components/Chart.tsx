import { useEffect, useState } from "react";
import { Alert, Flashbar } from "@cloudscape-design/components";
import { Vega } from "react-vega";

interface DataField {
  name: string;
  type: string;
  sample_value?: any;
}

interface Data {
  fields: DataField[];
  total_rows: number;
}

const VEGA_LITE_TYPES_MAP: { [key: string]: string } = {
  int: "quantitative",
  float: "quantitative",
  str: "nominal",
  bool: "nominal",
  date: "temporal",
  time: "temporal",
  datetime: "temporal",
};

function createVizDataDict(
  column_names: string[],
  column_types: string[],
  results: any[]
): Data {
  let data: Data = {
    fields: [],
    total_rows: results.length,
  };
  for (let i = 0; i < column_names.length; i++) {
    let column_name = column_names[i];
    data.fields.push({
      name: column_name,
      type: VEGA_LITE_TYPES_MAP[column_types[i]] || "nominal",
    });
  }
  for (let i = 0; i < results.length; i++) {
    // include 1 sample
    if (i === 1) {
      break;
    }
    let r = results[i];
    for (let j = 0; j < column_names.length; j++) {
      data.fields[j].sample_value = r[column_names[j]];
    }
  }
  return data;
}

export default function Chart({ data }: any) {
  const [vegaLiteSpec, setVegaLiteSpec] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log("Chart data", data);
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      const startTime = Date.now();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/viz`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: createVizDataDict(
                data.column_names || [],
                data.column_types || [],
                data.results || []
              ),
            }),
          }
        );

        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000;

        if (response.ok) {
          console.info(
            `Visualization generated in ${timeTaken.toFixed(2)} seconds`
          );
          const data = await response.json();
          const spec = {
            ...data.vega_lite_spec,
            data: { name: "table" },
            width: "700",
          };
          // Add sort property to 'x' encoding channel
          if (spec.encoding && spec.encoding.x) {
            spec.encoding.x.sort = "-y";
          }
          setVegaLiteSpec(spec);
        } else {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.error(err);
        console.log("err", err);
        setErrorMessage(
          "Sorry, I couldn't generate a visualization. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data]);

  if (isLoading) {
    return (
      <Flashbar
        items={[
          {
            type: "success",
            loading: true,
            content: "Generating visualization...",
            id: "Generating visualization",
          },
        ]}
      />
    );
  }

  if (errorMessage) {
    return (
      <Alert
        statusIconAriaLabel="Error"
        type="error"
        header="An error occurred"
      >
        {errorMessage}
      </Alert>
    );
  }

  return vegaLiteSpec && data.results ? (
    <Vega spec={vegaLiteSpec} data={{ table: data.results }} />
  ) : null;
}
