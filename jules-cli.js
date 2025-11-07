require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.JULES_API_KEY;
const BASE_URL = 'https://jules.googleapis.com/v1alpha';

if (!API_KEY) {
  console.error('Error: La variable de entorno JULES_API_KEY no está configurada.');
  console.error('Por favor, crea un archivo .env y añade tu clave de API.');
  process.exit(1);
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Goog-Api-Key': API_KEY,
    'Content-Type': 'application/json',
  },
});

const listSources = async () => {
  try {
    const response = await apiClient.get('/sources');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error al listar las fuentes:', error.response ? error.response.data : error.message);
  }
};

const createSession = async (prompt, source, branch = 'main', title) => {
  if (!prompt || !source) {
    console.error('Error: Se requiere un prompt y un source para crear una sesión.');
    console.log('Uso: node jules-cli.js create-session "<prompt>" "<source>" "[branch]" "[title]"');
    return;
  }

  try {
    const payload = {
      prompt,
      sourceContext: {
        source: source,
        githubRepoContext: {
          startingBranch: branch,
        },
      },
      automationMode: 'AUTO_CREATE_PR',
    };
    if (title) {
      payload.title = title;
    }

    const response = await apiClient.post('/sessions', payload);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error al crear la sesión:', error.response ? error.response.data : error.message);
  }
};

const listSessions = async () => {
  try {
    const response = await apiClient.get('/sessions?pageSize=10');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error al listar las sesiones:', error.response ? error.response.data : error.message);
  }
};

const listActivities = async (sessionId) => {
  if (!sessionId) {
    console.error('Error: Se requiere un ID de sesión.');
    console.log('Uso: node jules-cli.js list-activities <session-id>');
    return;
  }
  try {
    const response = await apiClient.get(`/sessions/${sessionId}/activities?pageSize=30`);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error al listar las actividades:', error.response ? error.response.data : error.message);
  }
};

const sendMessage = async (sessionId, prompt) => {
  if (!sessionId || !prompt) {
    console.error('Error: Se requiere un ID de sesión y un prompt.');
    console.log('Uso: node jules-cli.js send-message <session-id> "<prompt>"');
    return;
  }
  try {
    const response = await apiClient.post(`/sessions/${sessionId}:sendMessage`, { prompt });
    console.log('Mensaje enviado. La respuesta del agente aparecerá como una nueva actividad.');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.response ? error.response.data : error.message);
  }
};

const approvePlan = async (sessionId) => {
  if (!sessionId) {
    console.error('Error: Se requiere un ID de sesión.');
    console.log('Uso: node jules-cli.js approve-plan <session-id>');
    return;
  }
  try {
    const response = await apiClient.post(`/sessions/${sessionId}:approvePlan`);
    console.log('Plan aprobado para la sesión:', sessionId);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error al aprobar el plan:', error.response ? error.response.data : error.message);
  }
};

const getSession = async (sessionId) => {
  if (!sessionId) {
    console.error('Error: Se requiere un ID de sesión.');
    console.log('Uso: node jules-cli.js get-session <session-id>');
    return;
  }
  try {
    const response = await apiClient.get(`/sessions/${sessionId}`);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error al obtener la sesión:', error.response ? error.response.data : error.message);
  }
};

const getSource = async (sourceName) => {
  if (!sourceName) {
    console.error('Error: Se requiere un nombre de fuente.');
    console.log('Uso: node jules-cli.js get-source <source-name>');
    return;
  }
  try {
    const response = await apiClient.get(`/${sourceName}`);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error al obtener la fuente:', error.response ? error.response.data : error.message);
  }
};

const getActivity = async (activityName) => {
  if (!activityName) {
    console.error('Error: Se requiere un nombre de actividad.');
    console.log('Uso: node jules-cli.js get-activity <activity-name>');
    return;
  }
  try {
    const response = await apiClient.get(`/${activityName}`);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error al obtener la actividad:', error.response ? error.response.data : error.message);
  }
};

const main = () => {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case 'list-sources':
      listSources();
      break;
    case 'get-source':
      getSource(args[0]);
      break;
    case 'create-session':
      createSession(args[0], args[1], args[2], args[3]);
      break;
    case 'list-sessions':
      listSessions();
      break;
    case 'get-session':
      getSession(args[0]);
      break;
    case 'list-activities':
      listActivities(args[0]);
      break;
    case 'get-activity':
      getActivity(args[0]);
      break;
    case 'send-message':
      sendMessage(args[0], args[1]);
      break;
    case 'approve-plan':
      approvePlan(args[0]);
      break;
    default:
      console.log('Comando no reconocido. Comandos disponibles:');
      console.log('  list-sources');
      console.log('  get-source <source-name>');
      console.log('  create-session "<prompt>" "<source>" "[branch]" "[title]"');
      console.log('  list-sessions');
      console.log('  get-session <session-id>');
      console.log('  list-activities <session-id>');
      console.log('  get-activity <activity-name>');
      console.log('  send-message <session-id> "<prompt>"');
      console.log('  approve-plan <session-id>');
  }
};

main();
