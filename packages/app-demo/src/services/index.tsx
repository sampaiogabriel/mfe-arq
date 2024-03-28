import { useAxiosInstanceHook } from '@sampaiogabriel/util-axios';

type FiltroType = (filtro: any) => Promise<any>;

export interface ServicoType {
  get: FiltroType;
}

const useTodoServico = (): ServicoType => {
  const { axiosInstance } = useAxiosInstanceHook();
  const api = axiosInstance;

  const get: FiltroType = (filtro) =>
    api
      .get<any>('/')
      .then((response) => response.data)
      .catch((error) => ({ ...error?.response?.data, sucesso: false }));

  return {
    get,
  };
};

export default useTodoServico;
