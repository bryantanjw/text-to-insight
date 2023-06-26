"use client";

import { useState } from "react";
import TopNav from "./components/TopNav";
import SchemaConfig from "./components/SchemaConfig";
import {
  AppLayout,
  BreadcrumbGroup,
  Button,
  Container,
  ContentLayout,
  Header,
  Form,
  Autosuggest,
  SpaceBetween,
  AppLayoutProps,
  Link,
  Alert,
  Flashbar,
  Popover,
  StatusIndicator,
  ExpandableSection,
  Tabs,
} from "@cloudscape-design/components";

import TableOutput from "./components/Table";
import Chart from "./components/Chart";
import { Vega, VegaLite } from "react-vega";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_BASE;

const appLayoutAriaLabels: AppLayoutProps.Labels = {
  navigation: "Side navigation",
  navigationToggle: "Open side navigation",
  navigationClose: "Close side navigation",
  notifications: "Notifications",
  tools: "Help panel",
  toolsToggle: "Open help panel",
  toolsClose: "Close help panel",
};

const Breadcrumbs = () => {
  return (
    <BreadcrumbGroup
      items={[
        { text: "Home", href: "#" },
        { text: "Text-to-Insight", href: "#components" },
      ]}
      ariaLabel="Breadcrumbs"
    />
  );
};

type DataType = { result: any; sql_query: any; timeTaken: number } | null;

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [sqlExplanation, setSqlExplanation] = useState();
  const [isExplainSqlLoading, setIsExplainSqlLoading] = useState(false);

  const [isVisualizeLoading, setIsVisualizeLoading] = useState<boolean>(false);
  const [visualizeErrorMessage, setVisualizeErrorMessage] = useState<
    string | null
  >(null);
  const [vegaLiteSpec, setVegaLiteSpec] = useState<any>();

  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DataType>(null);

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const startTime = Date.now();
    try {
      const response = await fetch(`${API_ENDPOINT}/text_to_sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ natural_language_query: query }),
      });

      if (!response.ok) {
        console.error(response);
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      const timeTaken = (Date.now() - startTime) / 1000;

      setData({
        result: responseData.result,
        sql_query: responseData.sql_query,
        timeTaken,
      });

      explainSql(responseData.sql_query);
      visualize(responseData.result);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  async function explainSql(sql: string) {
    setIsExplainSqlLoading(true);

    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sql,
      }),
    };

    try {
      const response = await fetch(`${API_ENDPOINT}/explain_sql`, options);
      const data = await response.json();
      setSqlExplanation(data.explanation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplainSqlLoading(false);
    }
  }

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

  async function visualize(data: any) {
    setIsVisualizeLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch(`${API_ENDPOINT}/viz`, {
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
      });

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
      setVisualizeErrorMessage(
        "Sorry, I couldn't generate a visualization. Please try again."
      );
    } finally {
      setIsVisualizeLoading(false);
    }
  }

  const content = (
    <ContentLayout
      header={
        <Header
          variant="h1"
          info={<Link variant="info">BETA</Link>}
          description="Empowering SQL querying with large language models."
        >
          Text-to-Insight
        </Header>
      }
    >
      <SpaceBetween size="xxl">
        <Container header={<Header variant="h2">Search</Header>}>
          <form onSubmit={handleOnSubmit}>
            <Form
              actions={
                <Button variant="primary" disabled={isLoading}>
                  Run
                </Button>
              }
            >
              <Autosuggest
                onChange={({ detail }) => {
                  setQuery(detail.value);
                }}
                value={query}
                options={[
                  {
                    value:
                      "What are the top 5 cities with the highest crime rates?",
                  },
                  { value: "3 cities with the highest female to male ratio?" },
                  {
                    value:
                      "Zip code in Los Angeles with the most advanced degree holders",
                  },
                ]}
                ariaLabel="Autosuggest example with suggestions"
                placeholder="Ask anything..."
                empty="No matches found"
              />
            </Form>
          </form>
        </Container>

        {isLoading ? (
          <Flashbar
            items={[
              {
                type: "success",
                loading: true,
                content: "Generating SQL...",
                id: "Generating SQL message",
              },
            ]}
          />
        ) : null}

        {error ? (
          <Alert
            statusIconAriaLabel="Error"
            type="error"
            header="An error occurred"
          >
            {error.message}
          </Alert>
        ) : null}

        {data ? (
          <>
            <Alert statusIconAriaLabel="Info">
              SQL generated in {data.timeTaken.toFixed(2)} seconds
            </Alert>
            <Container>
              <pre
                style={{
                  overflowX: "scroll",
                  fontSize: "16px",
                  background: "#e3e3e3",
                  padding: "10px",
                  borderRadius: "12px",
                }}
              >
                <code>{data.sql_query}</code>
              </pre>

              <ExpandableSection
                variant="footer"
                headerText={"Explain this query"}
              >
                {isExplainSqlLoading ? (
                  <Flashbar
                    items={[
                      {
                        type: "success",
                        loading: true,
                        content: "Writing explanation...",
                        id: "Writing explanation",
                      },
                    ]}
                  />
                ) : (
                  sqlExplanation
                )}
              </ExpandableSection>
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  justifyContent: "flex-end",
                  top: "48px",
                  right: "35px",
                }}
              >
                <Popover
                  size="small"
                  position="top"
                  triggerType="custom"
                  dismissButton={false}
                  content={
                    <StatusIndicator type="success">Copied!</StatusIndicator>
                  }
                >
                  <Button
                    iconName="copy"
                    onClick={() => {
                      navigator.clipboard.writeText(data.sql_query);
                    }}
                  ></Button>
                </Popover>
              </div>

              <div style={{ marginTop: "30px" }}>
                <Tabs
                  tabs={[
                    {
                      label: "Records",
                      id: "records",
                      content: <TableOutput data={data.result} />,
                    },
                    {
                      label: "Chart",
                      id: "chart",
                      // <Chart data={data.result} />
                      content: isVisualizeLoading ? (
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
                      ) : visualizeErrorMessage ? (
                        <Alert
                          statusIconAriaLabel="Error"
                          type="error"
                          header="An error occurred"
                        >
                          {visualizeErrorMessage}
                        </Alert>
                      ) : (
                        vegaLiteSpec && (
                          <VegaLite
                            spec={vegaLiteSpec}
                            data={{ table: data.result.results }}
                          />
                        )
                      ),
                    },
                  ]}
                />
              </div>
            </Container>
          </>
        ) : null}
      </SpaceBetween>
    </ContentLayout>
  );

  return (
    <>
      <TopNav />
      <AppLayout
        contentType="form"
        content={content}
        breadcrumbs={<Breadcrumbs />}
        ariaLabels={appLayoutAriaLabels}
        toolsHide={true}
        navigationHide={true}
        splitPanel={<SchemaConfig />}
      />
    </>
  );
}
