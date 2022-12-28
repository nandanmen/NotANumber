import { Cards } from "~/experiments/Cards";
import {
  ExperimentsPage,
  ExperimentWrapper,
} from "~/components/layout/ExperimentsPage";

export default function CardsPage() {
  return (
    <ExperimentsPage page="cards">
      <Cards />
    </ExperimentsPage>
  );
}
