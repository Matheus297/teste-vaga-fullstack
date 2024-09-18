import fs from 'fs';
import csv from 'csv-parser';
import express from 'express';
import cors from 'cors';

const CsvFile = './utils/data.csv'

const app = express()
app.use(cors());


const formattedCurrencyBRL = (value: number): string  => {
    const formatter = new Intl.NumberFormat('pt-BR', {currency: 'BRL', style: 'currency'}).format(value)
    return formatter
}

const convertTimeDate = (value: number): string => {
    const date = new Intl.DateTimeFormat('pt-BR', {dateStyle: 'short'}).format(value)
    return date
}

const validateCPFandCNPJ = (value: string): string  => {
    const regex = '([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})'
    const validate = new RegExp(regex).test(value)

    if (!validate) {
        return 'Não válido'
    }else {
        return 'Dados válidos'
    }

}

const readCSVFile = (file: any, page: number, limit: number) => {
    const array: any[] = []
    const firstIndice = (page - 1) * limit;
    const lastIndice = page * limit
    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
        .pipe(csv())
        .on('data', (data) => {
            const keyMap: any = {
                'nrInst': 'nr_inst',
                'nrAgencia': 'nr_agencia',
                'nmClient': 'nm_client',
                'cdClient': 'cd_client',
                'dsProduto': 'ds_produto',
                'nrCpfCnpj': 'nr_cpf_cnpj',
                'nrContrato': 'nr_contrato',
                'dtContrato': 'dt_contrato',
                'qtPrestacoes': 'qt_prestacoes',
                'vlTotal': 'vl_total',
                'cdProduto': 'cd_produto',
                'cdCarteira': 'cd_carteira',
                'dsCarteira': 'ds_carteira',
                'nrProposta': 'nr_proposta',
                'nrPresta': 'nr_presta',
                'tpPresta': 'tp_presta',
                'nrSeqPre': 'nr_seq_pre',
                'dtVctPre': 'dt_vct_pre',
                'vlPresta': 'vl_presta',
                'vlMora': 'vl_mora',
                'vlMulta': 'vl_multa',
                'vlOutAcr': 'vl_out_acr',
                'vlIof': 'vl_iof',
                'vlDescon': 'vl_descon',
                'vlAtual': 'vl_atual',
                'idSituac': 'id_situac',
                'idSitVen': 'id_sit_ven'
            };
            

            const formatData = (data: any, keyMap: any) => {
                const formatted: any = {}


                for (const key in data) {
                    if(data.hasOwnProperty(key)) {
                        const newKey = keyMap[key] || key
                        formatted[newKey] = data[key]
                    }
                }
                return formatted
            }
            const formatDataJSON = formatData(data, keyMap)
            const formatDataJSONAdvanced = {
                ...formatDataJSON,
                vl_total: formattedCurrencyBRL(formatDataJSON.vl_total),
                vl_presta: formattedCurrencyBRL(formatDataJSON.vl_presta),
                vl_multa: formattedCurrencyBRL(formatDataJSON.vl_multa),
                vl_out_acr: formattedCurrencyBRL(formatDataJSON.vl_out_acr),
                vl_iof: formattedCurrencyBRL(formatDataJSON.vl_iof),
                vl_descon: formattedCurrencyBRL(formatDataJSON.vl_descon),
                vl_mora: formattedCurrencyBRL(formatDataJSON.vl_mora),
                vl_atual: formattedCurrencyBRL(formatDataJSON.vl_atual),
                dt_contrato: convertTimeDate(formatDataJSON.dt_contrato),
                dt_vct_pre: convertTimeDate(formatDataJSON.dt_vct_pre),
                vl_per_value: formattedCurrencyBRL(formatDataJSON.vl_total / Number(formatDataJSON.qt_prestacoes)),
                nr_cpf_cnpj: validateCPFandCNPJ(formatDataJSON.nr_cpf_cnpj)


            }
            array.push(formatDataJSONAdvanced)
        })
        .on('end', () => {
            const paginate = array.slice(firstIndice, lastIndice)
            resolve(paginate)
        })
    })
}


app.get('/users', async (req, res) => {
    const { page } = req.query;
    try {
        const data = await readCSVFile(CsvFile, Number(page) , 20); 
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Error CSV' });
      }
})

app.listen(3001, () => {
    console.log(`Servidor rodando na porta ${3001}`);
  });