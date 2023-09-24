const { Router } = require('express');
const j4router = Router();

const j4adminCtrl = require('../controllers/j4admin.controllers')


j4router.get('/admin/j4/puntovotacion', j4adminCtrl.getPtoVotacion)
        .get('/admin/j4/history/votacion', j4adminCtrl.getHistoryVotacion)
        .get('/estado/gis/donde/',j4adminCtrl.getLiderBarriosGIS)
        .get('/estado/total/votos/fecha', j4adminCtrl.getTotalVotosFecha)
        .get('/estado/history/porc-participacion', j4adminCtrl.getParticipacionElectoral)
        .get('/estado/total/potencial/porsex', j4adminCtrl.getPontecialVotosporSex)
        .get('/estado/resultados/elecciones/:vigecnia', j4adminCtrl.getResultadosFechas)
        .get('/estado/lideres/territoriales', j4adminCtrl.getLideresRegistrados)
        .get('/estado/lideres/barriales/:cedula', j4adminCtrl.getListadoBarrioLider)
        .get ('/admin/j4/consulta/lider/:cedula',j4adminCtrl.getCedulaValidated)
        .get('/estado/dondeestamos/barrios', j4adminCtrl.getCoberturaLiderBarrial)
        .get('/estado/dondeestamos/comunas', j4adminCtrl.getCoordinadorGIS)
        .get('/estado/lideres/comunas',j4adminCtrl.getCoberturaComunaLideresGIS)

        .delete('/estado/lideres/eliminar/:cedula', j4adminCtrl.deleteLiderBarrio )



module.exports = j4router