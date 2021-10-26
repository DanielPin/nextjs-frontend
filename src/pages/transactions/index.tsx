import {
  Column,
  IntegratedFiltering,
  IntegratedPaging,
  PagingState,
  SearchState,
  SortingState,
} from "@devexpress/dx-react-grid";
import { Button, Container, formatMs, Typography } from "@material-ui/core";
import {
  Grid,
  SearchPanel,
  Table,
  TableHeaderRow,
  PagingPanel,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";
import { GetServerSideProps, NextPage } from "next";
import { Token, validateAuth } from "../../utils/auth";
import makeHttp from "../../utils/http";
import { Transaction } from "../../utils/model";
import { format, parseISO } from "date-fns";
import AddIcon from "@material-ui/icons/Add";
import { useRouter } from "next/router";
import { Page } from "../../components/Page";
import { withAuth } from "../../hof/withAuth";

interface TransactionsPageProps {
  transactions: Transaction[];
}

const columns: Column[] = [
  {
    name: "payment_date",
    title: "Data pag.",
    getCellValue: (row: any, columnName: string) => {
      return format(parseISO(row[columnName].slice(0, 10)), "dd/MM/yyy");
    },
  },
  {
    name: "name",
    title: "Nome",
  },
  {
    name: "category",
    title: "Categoria",
  },
  {
    name: "type",
    title: "Operação",
  },
  {
    name: "created_at",
    title: "Criado em",
  },
];

console.log("vai criar as tabelas");
const TransactionsPage: NextPage<TransactionsPageProps> = (props) => {
  const router = useRouter();
  return (
    <Page>
      <Typography component="h1" variant="h4">
        Minhas transações
      </Typography>
      <Button
        startIcon={<AddIcon />}
        variant={"contained"}
        color="primary"
        onClick={() => router.push("/transactions/new")}
      >
        Criar
      </Button>
      <Grid rows={props.transactions} columns={columns}>
        <Table />
        <SortingState
          defaultSorting={[{ columnName: "created_at", direction: "desc" }]}
        />
        <SearchState defaultValue="Conta de luz" />
        <PagingState defaultCurrentPage={0} pageSize={5} />
        <TableHeaderRow showSortingControls />
        <IntegratedFiltering />
        <Toolbar />
        <SearchPanel />
        <PagingPanel />
        <IntegratedPaging />
      </Grid>
    </Page>
  );
};

export default TransactionsPage;

export const getServerSideProps = withAuth(async (ctx, { token }) => {
  const { data: transactions } = await makeHttp(token).get("transactions");

  return {
    props: {
      transactions,
    },
  };
});
