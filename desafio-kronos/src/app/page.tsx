"use client"

import { useEffect, useRef, useState } from "react";
import { getUsers } from "@/api/api";
import CircularProgress from '@mui/material/CircularProgress';

interface Contrato {
  nr_inst: string;
  nr_agencia: string;
  cd_client: string;
  nm_client: string;
  nr_cpf_cnpj: string;
  nr_contrato: string;
  dt_contrato: string;
  qt_prestacoes: string;
  vl_total: string;
  cd_produto: string;
  ds_produto: string;
  cd_carteira: string;
  ds_carteira: string;
  nr_proposta: string;
  nr_presta: string;
  tp_presta: string;
  nr_seq_pre: string;
  dt_vct_pre: string;
  vl_presta: string;
  vl_mora: string;
  vl_multa: string;
  vl_out_acr: string;
  vl_iof: string;
  vl_descon: string;
  vl_atual: string;
  id_situac: string;
  id_sit_ven: string;
  vl_per_value: string;
}


export default function Home() {
  const [contrato, setContrato] = useState<Contrato[]>([])
  const [page, setPage] = useState<number>(1)
  const [loadingData, setLoadingData] = useState(false);
  const containerRef = useRef<HTMLDivElement | any>(null)


  const loadUsers = async (currentPage: number) => {
    if (loadingData) return;
  
    setLoadingData(true);
    try {
      const response: any = await getUsers(currentPage);
      setContrato((prevContrato) => [...prevContrato, ...response?.data]);
    } catch (error) {
    } finally {
      setLoadingData(false);
    }
  };
  
  const handleScroll = () => {
    if (!containerRef.current || loadingData) return;
  
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const container = containerRef.current;
  
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      container.removeEventListener('scroll', handleScroll);
      setPage((prevPage) => prevPage + 1);
    }
  };
  
  useEffect(() => {
    loadUsers(page);
  }, [page]); 
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
  }, [loadingData]); 


  return (
   <div ref={containerRef} id="container">
    <table>
    <thead>
      <tr>
        <th>Nº inst</th>
        <th>Nº agência</th>
        <th>Nome cliente</th>
        <th>CPF/CNPJ</th>
        <th>Nº contrato</th>
        <th>Data contrato</th>
        <th>Qt. prestações</th>
        <th>Valor total</th>
        <th>Cd produto</th>
        <th>Ds produto</th>
        <th>Cd carteira</th>
        <th>Ds carteira</th>
        <th>Nº presta</th>
        <th>Tp. presta</th>
        <th>Nº Seqpre</th>
        <th>Dt vctpre</th>
        <th>Valor presta</th>
        <th>Valor mora</th>
        <th>Valor multa</th>
        <th>Valor out</th>
        <th>Valor iof</th>
        <th>Valor desconto</th>
        <th>Valor atual</th>
        <th>Id sit</th>
        <th>Id sit venc</th>
        <th>Valor por prestação</th>
      </tr>
    </thead>
    <tbody>
        {contrato && contrato.map((cont) => {
          return (
            <tr>
              <td key={cont.id_situac}>{cont.nr_inst}</td>
              <td >{cont.nr_agencia || ''}</td>
              <td >{cont.nm_client || ''}</td>
              <td >{cont.nr_cpf_cnpj || ''}</td>
              <td >{cont.nr_contrato || ''}</td>
              <td >{cont.dt_contrato || ''}</td>
              <td >{cont.qt_prestacoes || ''}</td>
              <td >{cont.vl_total || ''}</td>
              <td >{cont.cd_produto || ''}</td>
              <td >{cont.ds_produto || ''}</td>
              <td >{cont.cd_carteira || ''}</td>
              <td >{cont.ds_carteira || ''}</td>
              <td >{cont.nr_presta || ''}</td>
              <td >{cont.tp_presta || ''}</td>
              <td >{cont.nr_seq_pre || ''}</td>
              <td >{cont.dt_vct_pre || ''}</td>
              <td >{cont.vl_presta || ''}</td>
              <td >{cont.vl_mora || ''}</td>
              <td >{cont.vl_multa || ''}</td>
              <td >{cont.vl_out_acr || ''}</td>
              <td >{cont.vl_iof || ''}</td>
              <td >{cont.vl_descon || ''}</td>
              <td >{cont.vl_atual || ''}</td>
              <td >{cont.id_situac || ''}</td>
              <td >{cont.id_sit_ven || ''}</td>
              <td >{cont.vl_per_value || ''}</td>
            </tr>
          )
        })}
    </tbody>
   </table>
        <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
          <CircularProgress size={25} color="inherit" />
        </div>
   </div>
  );
}
