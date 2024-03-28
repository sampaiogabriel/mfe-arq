import { useAxios } from "@sampaiogabriel/util-axios";

type FiltroType = (filtro?: any) => Promise<any>;

export interface ServicoType {
  get: FiltroType;
}

const useTodoServico = (): ServicoType => {
  const api = useAxios({
    prefixo: "",
  });

  const get: FiltroType = (filtro) =>
    api
      .get<any>("/")
      .then((response) => response.data)
      .catch((error) => ({ ...error?.response?.data, sucesso: false }));

  return {
    get,
  };
};

export default useTodoServico;
