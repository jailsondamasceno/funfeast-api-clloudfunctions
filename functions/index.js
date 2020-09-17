const functions = require('firebase-functions');
const admin = require('firebase-admin')
const cors = require('cors')({
     origin: true
});

admin.initializeApp();
const db = admin.firestore()

//------------------------------------------ORDEM DAS FUNÇÔES-----------------------------------------------
//getCodeCellphoneCountrys
//getCountrys
//getStates
//getCitys
//getCategoryProviders
//saveUser
//editUser
//getUserByName
//guestsByEvent
//sponsorsByEvent
//getUserById
//getCategoryEvents
//addEvent
//getEvents
//eventsByOrganizer
//getEventById
//sendInvitation
//resquestInvitation
//getInvitatiosByUser
//getRequestsInvitations
//responseInvitation
//approveOrDisapproveInvitation
//getBalanceUser
//getBalanceSafeBoxe
//movimetationsSafeBox
//movimetationsSafeBoxUser
//depositWalletForSafeBox
//movimetationsWallet
//servicesRequestsByEvent
//addService
//updateService
//servicesRequestsByProviders
//servicesByProvider
//requestService
//updateRequest
//getServicesByProvider
//getServices
//confirmOrRejectBuy


//-----------------------------------------------------------------------------------------------------------
//======================================Inicio Default=======================================================
//Buscar Códigos de telefone dos paises
exports.getCodeCellphoneCountrys = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const codes = []
               const cod = await db.collection('codigosTelefonesPaises').get()
               cod.forEach(co => {
                    const c = { value: co.data().code, label: co.data().country }
                    codes.push(c)
               })
               res.status(200).send(codes)

          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }
     })
})

//Buscar Paises
exports.getCountrys = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const countrys = []
               const coun = await db.collection('paises').get()
               coun.forEach(co => {
                    const count = { id: co.id, ...co.data() }
                    countrys.push(count)
               })
               res.status(200).send(countrys)

          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }
     })
})

//Buscar estados
exports.getStates = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const states = []
               const stat = await db.collection('paises').doc(`${req.query.id_country}`).collection('estados').get()
               stat.forEach(st => {
                    const sta = { id: st.id, ...st.data() }
                    states.push(sta)
               })
               res.status(200).send(states)

          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }
     })
})

//Buscar cidades
exports.getCitys = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const citys = []
               const city = await db.collection('paises').doc(`${req.query.id_country}`)
                    .collection('estados').doc(`${req.query.id_state}`).collection('cidades').get()
               city.forEach(cit => {
                    const cits = { id: cit.id, ...cit.data() }
                    citys.push(cits)
               })
               res.status(200).send(citys)

          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }
     })
})

//Buscar cidades
exports.getCategoryProviders = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const categories = []
               const catego = await db.collection('categorias').get()
               catego.forEach(cate => {
                    const cat = { value: cate.id, label: cate.data().category }
                    categories.push(cat)
               })
               res.status(200).send(categories)

          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }
     })
})
//======================================Fim Default=======================================================
//======================================Inicio Usuarios=======================================================
//Cadastro usuario
exports.saveUser = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const user = {
                    invitations: req.body.invitations || [],
                    sponsorships: req.body.sponsorships || [],
                    email: req.body.email,
                    name: req.body.name,
                    cellphone: req.body.cellphone,
                    lastName: req.body.lastName,
                    photoURL: req.body.photoURL || '',
                    profile: req.body.profile,
                    category: req.body.category || '',
                    typeProvider: req.body.typeProvider || '',
                    cnpj: req.body.cnpj || '',
                    company_name: req.body.company_name || '',
                    profile: req.body.profile,
                    country: req.body.country,
                    state: req.body.state,
                    city: req.body.city,
                    street: req.body.street

               }
               await db.collection('usuarios').doc(`${req.body.uid}`).set(user)
               await admin.auth().setCustomUserClaims(req.body.uid, { profile: user.profile })
               res.status(200).send('Usuário cadastrado com sucesso!')
          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }
     })
})
//Cadastro usuario
exports.editUser = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               await db.collection('usuarios').doc(`${req.query.id_user}`).update(req.body)
               res.status(200).send('Usuário editado com sucesso!')
          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }
     })
})

//Pesquisar usuário pelo nome
exports.getUserByName = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const users = []
               var filter = req.query.filter.toUpperCase()

               const resp = await db.collection('usuarios').get()
               resp.forEach(user => {
                    if (user.data().name.toUpperCase().indexOf(filter) > -1) {
                         users.push({ id: user.id, ...user.data() })
                    }
               })
               Promise.all(users)
               res.status(200).send(users)
          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }
     })
})

//Pesquisar usuário pelo nome
exports.getUserByCellPhone = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const cellPhone = `+${req.query.cellPhone}`
               console.log(cellPhone)
               const users = []
               const resp = await db.collection('usuarios').where('cellPhone', '==', `${cellPhone}`).get()
               resp.forEach(user => {
                    const us = { id: user.id, ...user.data() }
                    users.push(us)
               })
               console.log(users)
               res.status(200).send(users)
          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }
     })
})

//Buscar Convidados Por Evento
exports.guestsByEvent = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const guests = []
               const gues = await db.collection('usuarios').where('invitations', 'array-contains', `${req.query.id_event}`).get()
               gues.forEach(gu => {
                    const guest = { id: gu.id, ...gu.data() }
                    guests.push(guest)
               })
               res.status(200).send(guests)

          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }
     })
})
//Buscar Patrocinadores Por Evento
exports.sponsorsByEvent = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const sponsors = []
               const spons = await db.collection('usuarios').where('sponsorships', 'array-contains', `${req.query.id_event}`).get()
               spons.forEach(sponso => {
                    const sp = { id: sponso.id, ...sponso.data() }
                    sponsors.push(sp)
               })
               const spon = await Promise.all(sponsors)
               const populate = async (spo) => {
                    for (var i = 0; i < spo.length; i++) {
                         const country = await db.collection('paises').doc(`${spo[i].country}`).get()  //Sem necessidade por enquanto
                         const state = await db.collection('paises').doc(`${spo[i].country}`)
                              .collection('estados').doc(`${spo[i].state}`).get()
                         const city = await db.collection('paises').doc(`${spo[i].country}`)
                              .collection('estados').doc(`${spo[i].state}`).collection('cidades').doc(`${spo[i].city}`).get()

                         spo[i].country_name = country.data().country
                         spo[i].state_name = state.data().state
                         spo[i].city_name = city.data().city
                    }
                    return spo
               }
               const returnSponsors = await populate(spon)
               res.status(200).send(returnSponsors)

          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }
     })
})

//Buscar usuario por id
exports.getUserById = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const us = await db.collection('usuarios').doc(`${req.query.id_user}`).get()
               const user = { id: us.id, ...us.data() }

               const country = await db.collection('paises').doc(`${user.country}`).get()
               const state = await db.collection('paises').doc(`${user.country}`)
                    .collection('estados').doc(`${user.state}`).get()
               const city = await db.collection('paises').doc(`${user.country}`)
                    .collection('estados').doc(`${user.state}`).collection('cidades').doc(`${user.city}`).get()
               const creator = await db.collection('usuarios').doc(`${user.id}`).get()

               user.country_name = country.data().country
               user.state_name = state.data().state
               user.city_name = city.data().city
               user.organizer = creator.data().name

               res.status(200).send(user)
          } catch (e) {
               console.log(e)
               res.status(500).json('Erro ao buscar usuario')
          }
     })
})

//Enviar convites para os usuários
exports.sendInvitation = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const invitation = {
                    id_receiver: req.body.id_receiver,
                    id_sender: req.body.id_sender,
                    id_event: req.body.id_event,
                    type: req.body.type
               }
               const resp = await db.collection('usuarios').doc(`${req.body.id_receiver}`)
                    .collection('invitations').where('id_event', '==', `${invitation.id_event}`).get()
               if (resp.docs.length > 0) {
                    res.status(200).send('Usuário já foi convidado para este evento!')
               } else {
                    await db.collection('usuarios').doc(`${req.body.id_receiver}`).collection('invitations').add(invitation)
                    res.status(200).send('Convite enviado com sucesso!')
               }
          } catch (e) {
               console.log(e)
               res.status(500).json('Erro ao salvar convite')
          }
     })
})

//Pedir um convite para o criador do evento
exports.resquestInvitation = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const requestInvitation = {
                    id_requester: req.body.id_requester,
                    id_organizer: req.body.id_organizer,
                    id_event: req.body.id_event,
                    type: req.body.type
               }
               const resp = await db.collection('usuarios').doc(`${req.body.id_organizer}`)
                    .collection('requestInvitations').where('id_event', '==', `${requestInvitation.id_event}`)
                    .where('type', '==', `${requestInvitation.type}`).get()
               if (resp.docs.length > 0) {
                    res.status(200).send({ collor: 'red', msg: `Você já solicitou um convite para ser um ${requestInvitation.type} deste evento!` })
               } else if (requestInvitation.id_organizer === requestInvitation.id_requester) {
                    res.status(200).send({ collor: 'red', msg: `Você não pode enviar um convite para seu próprio evento!` })
               } else {
                    await db.collection('usuarios').doc(`${req.body.id_organizer}`).collection('requestInvitations').add(requestInvitation)
                    res.status(200).send({ collor: 'green', msg: 'Convite enviado com sucesso!' })
               }
          } catch (e) {
               console.log(e)
               res.status(500).json('Erro na solicitação do pedido!')
          }
     })
})


//Buscar meus convites
exports.getInvitatiosByUser = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const invitations = []
               const invitation = await db.collection('usuarios').doc(`${req.query.id_user}`).collection('invitations').get()
               invitation.forEach(invit => {
                    const inv = { id: invit.id, ...invit.data() }
                    invitations.push(inv)
               })
               const invi = await Promise.all(invitations)
               const populate = async (invita) => {
                    for (var i = 0; i < invita.length; i++) {
                         const receiver = await db.collection('usuarios').doc(`${invita[i].id_receiver}`).get()
                         const sender = await db.collection('usuarios').doc(`${invita[i].id_sender}`).get()
                         const event = await db.collection('eventos').doc(`${invita[i].id_event}`).get()

                         invita[i].receiver_name = receiver.data().name
                         invita[i].sender_name = sender.data().name
                         invita[i].event_title = event.data().title
                         invita[i].type = invita[i].type == 'SPONSOR' ? 'PRATROCINADOR' : 'CONVIDADO'
                    }
                    return invita
               }
               const returnInvitations = await populate(invi)
               res.status(200).send(returnInvitations)
          } catch (e) {
               console.log(e)
               res.status(500).json('Erro ao buscar convites')
          }
     })
})

//Buscar meus convites
exports.getRequestsInvitations = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const invitations = []
               var requestInvitations = ''
               console.log(req.body)
               if (req.body.id_event && req.body.typeInvitation) {
                    requestInvitations = await db.collection('usuarios').doc(`${req.query.id_user}`)
                         .collection('requestInvitations').where('id_event', '==', `${req.body.id_event}`)
                         .where('type', '==', `${req.body.typeInvitation}`).get()
               } else if (req.body.id_event && !req.body.typeInvitation) {
                    requestInvitations = await db.collection('usuarios').doc(`${req.query.id_user}`)
                         .collection('requestInvitations').where('id_event', '==', `${req.body.id_event}`).get()
               } else if (!req.body.id_event && req.body.typeInvitation) {
                    requestInvitations = await db.collection('usuarios').doc(`${req.query.id_user}`)
                         .collection('requestInvitations').where('type', '==', `${req.body.typeInvitation}`).get()
               } else {
                    requestInvitations = await db.collection('usuarios').doc(`${req.query.id_user}`).collection('requestInvitations').get()
               }

               requestInvitations.forEach(invit => {
                    const inv = { id: invit.id, ...invit.data() }
                    invitations.push(inv)
               })
               const invi = await Promise.all(invitations)
               const populate = async (invita) => {
                    for (var i = 0; i < invita.length; i++) {
                         const requester = await db.collection('usuarios').doc(`${invita[i].id_requester}`).get()
                         const event = await db.collection('eventos').doc(`${invita[i].id_event}`).get()

                         invita[i].receiver_name = requester.data().name
                         invita[i].event_title = event.data().title
                         invita[i].type = invita[i].type
                         // invita[i].type = invita[i].type == 'SPONSOR' ? 'PRATROCINADOR' : 'CONVIDADO'
                    }
                    return invita
               }
               const returnRequestInvitations = await populate(invi)
               res.status(200).send(returnRequestInvitations)
          } catch (e) {
               console.log(e)
               res.status(500).json('Erro ao buscar convites')
          }
     })
})

//Aceitar ou recusar convite
exports.responseInvitation = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const typeResponse = req.body.typeResponse
               const typeInvitation = req.body.typeInvitation
               const id_receiver = req.body.id_receiver
               const id_invitation = req.body.id_invitation
               const id_event = req.body.id_event
               if (typeResponse == 'ACCEPT') {
                    const receiver = await db.collection('usuarios').doc(`${id_receiver}`).get()
                    const user = receiver.data()
                    typeInvitation == 'PATROCINADOR' ?
                         user.sponsorships.push(id_event) :
                         user.invitations.push(id_event)
                    await db.collection('usuarios').doc(`${id_receiver}`).update(user)
                    await db.collection('usuarios').doc(`${id_receiver}`).collection('invitations').doc(`${id_invitation}`).delete()
                    res.status(200).send('Você agora é um convidado!')
               } else {
                    await db.collection('usuarios').doc(`${id_receiver}`).collection('invitations').doc(`${id_invitation}`).delete()
                    res.status(200).send('Você recusou o convite!')
               }

          } catch (e) {
               console.log(e)
               res.status(500).json('Erro na resposta do convite')
          }
     })
})

//Aprovar ou recusar o pedido de convite
exports.approveOrDisapproveInvitation = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const typeResponse = req.body.typeResponse
               const typeInvitation = req.body.typeInvitation
               const id_requester = req.body.id_requester
               const id_organizer = req.body.id_organizer
               const id_requestInvitation = req.body.id_requestInvitation
               const id_event = req.body.id_event
               if (typeResponse == 'ACCEPT') {
                    const requester = await db.collection('usuarios').doc(`${id_requester}`).get()
                    const user = requester.data()
                    typeInvitation == 'PATROCINADOR' ?
                         user.sponsorships.push(id_event) :
                         user.invitations.push(id_event)
                    await db.collection('usuarios').doc(`${id_requester}`).update(user)
                    await db.collection('usuarios').doc(`${id_organizer}`).collection('requestInvitations').doc(`${id_requestInvitation}`).delete()
                    res.status(200).send('Solicitação aprovada!')
               } else {
                    await db.collection('usuarios').doc(`${id_organizer}`).collection('requestInvitations').doc(`${id_requestInvitation}`).delete()
                    res.status(200).send('Solicitação negada!')
               }

          } catch (e) {
               console.log(e)
               res.status(500).json('Erro na resposta do convite')
          }
     })
})

//======================================Fim Usuarios========================================================
//======================================Inicio Eventos=======================================================
//Buscar categorias de eventos
exports.getCategoryEvents = functions.https.onRequest(async (req, res) => {

     cors(req, res, async () => {
          try {
               const categories = []
               const catego = await db.collection('categoriasEventos').get()
               catego.forEach(cate => {
                    const cat = { value: cate.id, label: cate.data().category }
                    categories.push(cat)
               })
               res.status(200).send(categories)

          } catch (e) {
               res.status(500).json(e)
          }
     })
});


//adicionarEvento
exports.addEvent = functions.https.onRequest(async (req, res) => {
     //Os dados como latitude e logitude serão gerados quando o evento for salvo
     //status eventos = AGENDADO CONFIRMADO REALIZADO CANCELADO
     cors(req, res, async () => {
          try {
               const date_event = new Date(req.body.date).getTime()
               const event = {
                    id_organizer: req.body.id_organizer,
                    sponsors: [],
                    service_providers: [],
                    guests: [],
                    title: req.body.title,
                    category: req.body.category,
                    description: req.body.description,
                    public: req.body.public,
                    date: date_event,
                    hour: req.body.hour,
                    status: req.body.status,
                    url_image: req.body.url_image || '',
                    country: req.body.country,
                    state: req.body.state,
                    city: req.body.city,
                    street: req.body.street || ''
               }
               await db.collection('eventos').add(event)
               res.status(200).json('Evento criado com suscesso!')
          } catch (e) {
               res.status(500).json(e)
          }
     })
});



//buscarEventos
exports.getEvents = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const country = req.body.country
               const state = req.body.state
               const city = req.body.city
               const category = req.body.category.value || ''
               const status = req.body.status || 'CONFIRMADO'
               var last = req.body.last.date || ''
               const limit = 2
               var search = ''
               if (req.body.category) {
                   search = db.collection('eventos')
                    .where('country', '==', `${country}`)
                    .where('state', '==', `${state}`)
                    .where('city', '==', `${city}`)
                    .where('category', '==', `${category}`)
                    .where('status', '==', `${status}`)
                    .orderBy('date', 'desc')
                    .limit(limit)

               } else {
                    search = db.collection('eventos')
                         .where('country', '==', `${country}`)
                         .where('state', '==', `${state}`)
                         .where('city', '==', `${city}`)
                         .where('status', '==', `${status}`)
                         .orderBy('date', 'desc')
                         .limit(limit)
               }
               
               if (!last) {
                    var resp = await search.get()
                    last = resp.docs.length > 0 ? resp.docs[0].data().date : ''
               }

               const events = []
               const respo = await search.startAt(last).get()
               respo.forEach(event => {
                    const ev = {
                         id: event.id,
                         ...event.data()
                    }
                    events.push(ev)
               })

               const evts = await Promise.all(events)
               const buscarUsers = async (evs) => {
                    for (var i = 0; i < evs.length; i++) {
                         // const country = await db.collection('paises').doc(`${evs[i].country}`).get()  //Sem necessidade por enquanto
                         const state = await db.collection('paises').doc(`${evs[i].country}`)
                              .collection('estados').doc(`${evs[i].state}`).get()
                         const city = await db.collection('paises').doc(`${evs[i].country}`)
                              .collection('estados').doc(`${evs[i].state}`).collection('cidades').doc(`${evs[i].city}`).get()
                         const user = await db.collection('usuarios').doc(`${evs[i].id_organizer}`).get()
                         const likes = await db.collection('eventos').doc(`${evs[i].id}`).collection('likes').get()

                         evs[i].organizer = user.data().name
                         // evs[i].country_name = country.data().country
                         evs[i].state_name = state.data().state
                         evs[i].city_name = city.data().city
                         evs[i].likes = likes.docs.length  // No futuro posso implementar o envio dos usuários que curtiram
                    }
                    return evs
               }
               const returEvents = await buscarUsers(evts)
               
               var id_last = respo.docs.length > 0 ? respo.docs[respo.docs.length - 1].id : ''
               var dados = respo.docs.length > 0 ? respo.docs[respo.docs.length - 1].data() : {}
               var next = { id: id_last, ...dados }
               var more = respo.docs.length > 1 ? true : false
               
               res.status(200).send({ events: returEvents, last: next, loadMore: more })

          } catch (e) {
               console.log(e)
               res.status(500).end('erro',e)
          }
     })
});

//Eventos por criador
exports.eventsByOrganizer = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const events = []
               const docs = await db.collection('eventos').where('id_organizer', '==', `${req.query.id_organizer}`).get()
               docs.forEach(event => {
                    const ev = {
                         id: event.id,
                         ...event.data()
                    }
                    events.push(ev)
               })

               const evts = await Promise.all(events)
               const buscarUsers = async (evs) => {
                    for (var i = 0; i < evs.length; i++) {
                         // const country = await db.collection('paises').doc(`${evs[i].country}`).get()  //Sem necessidade por enquanto
                         const state = await db.collection('paises').doc(`${evs[i].country}`)
                              .collection('estados').doc(`${evs[i].state}`).get()
                         const city = await db.collection('paises').doc(`${evs[i].country}`)
                              .collection('estados').doc(`${evs[i].state}`).collection('cidades').doc(`${evs[i].city}`).get()
                         const user = await db.collection('usuarios').doc(`${evs[i].id_organizer}`).get()
                         const likes = await db.collection('eventos').doc(`${evs[i].id}`).collection('likes').get()

                         evs[i].organizer = user.data().name
                         // evs[i].country_name = country.data().country
                         evs[i].state_name = state.data().state
                         evs[i].city_name = city.data().city
                         evs[i].likes = likes.docs.length  // No futuro posso implementar o envio dos usuários que curtiram
                    }
                    return evs
               }
               const returEvents = await buscarUsers(evts)
               res.status(200).send(returEvents)


          } catch (e) {
               console.log(e)
               res.status(500).end(e)
          }
     })
});

//Buscar evento por id
exports.getEventById = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const ev = await db.collection('eventos').doc(`${req.query.id_event}`).get()
               const date = new Date(ev.data().date).toLocaleDateString()
               ev.data().date = date
               const event = {
                    id: ev.id,
                    ...ev.data()
               }
               const country = await db.collection('paises').doc(`${event.country}`).get()
               const state = await db.collection('paises').doc(`${event.country}`)
                    .collection('estados').doc(`${event.state}`).get()
               const city = await db.collection('paises').doc(`${event.country}`)
                    .collection('estados').doc(`${event.state}`).collection('cidades').doc(`${event.city}`).get()
               const creator = await db.collection('usuarios').doc(`${event.id_organizer}`).get()
               const likes = await db.collection('eventos').doc(`${event.id}`).collection('likes').get()

               event.country_name = country.data().country
               event.state_name = state.data().state
               event.city_name = city.data().city
               event.organizer = creator.data().name
               event.likes = likes.docs.length  // No futuro posso implementar o envio dos usuários que curtiram


               res.status(200).send(event)

          } catch (e) {
               res.status(500).json('Erro ao buscar evento')
          }
     })
})

//Avaliar evento
exports.likeEvent = functions.https.onRequest(async (req, res) => {
     //Os dados como latitude e logitude serão gerados quando o evento for salvo
     cors(req, res, async () => {
          try {
               const like = { id_user: req.body.id_user }
               const likes = await db.collection('eventos').doc(`${req.body.id_event}`)
                    .collection('likes').where('id_user', '==', `${req.body.id_user}`).get()
               if (likes.docs.length > 0) {
                    likes.forEach(lik => {
                         db.collection('eventos').doc(`${req.body.id_event}`)
                              .collection('likes').doc(`${lik.id}`).update(like)
                    })
               } else {
                    await db.collection('eventos').doc(`${req.body.id_event}`)
                         .collection('likes').add(like)
               }
               res.status(200).json('Like enviado com suscesso!')
          } catch (e) {
               res.status(500).json(e)
          }
     })
});

//======================================Fim Eventos========================================================
//======================================Inicio Cofre=======================================================
//Buscar Saldo do Usuário
const getBalanceSafeBoxe = async (id_event) => {
     try {
          var cred = 0
          var deb = 0
          var balance = 0
          const response = await db.collection('eventos').doc(`${id_event}`).collection('movimentacoes_cofre').get()
          response.forEach(movi => {
               if (movi.data().type === 'CREDITO') {
                    cred += movi.data().value
               } else {
                    deb += movi.data().value
               }
          })
          balance = cred - deb
          return parseFloat(balance)
     } catch (e) {
          return e
     }
}

//Buscar Movimentaçoes na Carteira do usuário
exports.movimetationsSafeBox = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const movimentations = []
               var cred = 0
               var deb = 0
               var balance = 0
               const movis = await db.collection('eventos').doc(`${req.query.id_event}`).collection('movimentacoes_cofre').get()
               movis.forEach(movi => {
                    if (movi.data().type === 'CREDITO') {
                         cred += movi.data().value
                    } else {
                         deb += movi.data().value
                    }
                    const mo = {
                         id: movi.id,
                         ...movi.data()
                    }
                    movimentations.push(mo)
               })

               balance = parseFloat(cred - deb)

               const response = { movimentations: movimentations, balance: balance }
               res.status(200).send(response)
          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }

     })
})
//Buscar Movimentaçoes na Carteira do usuário
exports.movimetationsSafeBoxUser = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const movimentations = []
               const movis = await db.collection('eventos').doc(`${req.body.id_event}`).collection('movimentacoes_cofre')
                    .where('id_user', '==', `${req.query.id_user}`).get()
               movis.forEach(movi => {
                    const mo = {
                         id: movi.id,
                         ...movi.data()
                    }
                    movimentations.push(mo)
               })

               res.status(200).send(movimentations)
          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }

     })
})
//Fazer um depósito no  cofre de um evento vinda da carteira
exports.depositWalletForSafeBox = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const val = parseFloat(req.body.value)
               const safeBox = {
                    id_user: req.body.id_user,
                    id_user_receiver: '',
                    type: 'CREDITO',
                    value: val,
                    description: 'Depósito'
               }
               const wallet = {
                    type: 'DEBITO',
                    value: val,
                    description: `Depósito no cofre do evento ${req.body.description}`
               }

               var balance = await getBalanceUser(req.body.id_user)
               if (balance < req.body.value) {
                    throw 'Saldo insufiente na carteira. Faça uma recargar!'
               } else {

                    await db.collection('eventos').doc(`${req.body.id_event}`).collection('movimentacoes_cofre').add(safeBox)
                    await db.collection('usuarios').doc(`${req.body.id_user}`).collection('movimentacoes_carteira').add(wallet)

                    res.status(200).send('Deposito realizado co sucesso!')
               }
          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }

     })
})

//======================================Fim Cofre============================================================
//======================================Inicio Carteira======================================================

//Buscar Saldo do Usuário
const getBalanceUser = async (id_user) => {
     try {
          var cred = 0
          var deb = 0
          var balance = 0
          const response = await db.collection('usuarios').doc(`${id_user}`).collection('movimentacoes_carteira').get()
          response.forEach(movi => {
               if (movi.data().type === 'CREDITO') {
                    cred += movi.data().value
               } else {
                    deb += movi.data().value
               }
          })
          balance = cred - deb
          return parseFloat(balance)
     } catch (e) {
          return e
     }
}


//Buscar Movimentaçoes na Carteira do usuário
exports.movimetationsWallet = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               var cred = 0
               var deb = 0
               var balance = 0
               const movimentations = []
               const movis = await db.collection('usuarios').doc(`${req.query.id_user}`).collection('movimentacoes_carteira').get()
               movis.forEach(movi => {
                    if (movi.data().type === 'CREDITO') {
                         cred += movi.data().value
                    } else {
                         deb += movi.data().value
                    }
                    const mo = {
                         id: movi.id,
                         ...movi.data()
                    }
                    movimentations.push(mo)
               })

               balance = cred - deb
               const response = { movimentations: movimentations, balance: balance }

               res.status(200).send(response)
          } catch (e) {
               console.log(e)
               res.status(500).send(e)
          }

     })
})


//======================================Fim Caterira============================================================
//======================================Inicio Servicos======================================================

//Adicionar um serviço
exports.addService = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               var description = servi[i].description || ''
               var s_desciption = `${description.slice(0, 50)}...`
               const service = {
                    id_service_provider: req.body.id_service_provider,
                    id_category: req.body.id_category,
                    title: req.body.title,
                    description: req.body.description,
                    short_description: s_desciption,
                    linkVideo: req.body.linkVideo || '',
                    value: req.body.value
               }
               await db.collection('servicos').add(service)
               res.status(200).send({ color: 'green', msg: 'Serviço criado com sucessso!' })

          } catch (e) {
               console.log(e)
               res.status(500).end(e)
          }
     })
});

//Atualiza um serviço
exports.updateService = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const service = {
                    id_category: req.body.id_category,
                    title: req.body.title,
                    description: req.body.description,
                    value: req.body.value
               }
               await db.collection('sevicosPedidos').update(service)
               res.status(200).send('Serviço atualizado com sucesso!')
          } catch (e) {
               console.log(e)
               res.status(500).end(e)
          }
     })
});
//Buscar serviços contratados para o evento
exports.servicesRequestsByEvent = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               //status: COMFIRMADO - AGUARDANDO CONFIRMACAO - REJEITADO
               const services = []
               var search = ''
               if (req.body.status) {
                    search = await db.collection('servicosPedidos')
                         .where('id_event', '==', `${req.body.id_event}`)
                         .where('status', '==', `${req.body.status}`).get()
               } else {
                    search = await db.collection('servicosPedidos')
                         .where('id_event', '==', `${req.body.id_event}`).get()
               }
               search.forEach(serv => {
                    const ser = { id: serv.id, ...serv.data() }
                    services.push(ser)
               })

               const serv_contr = await Promise.all(services)
               const populate = async (servi) => {
                    for (var i = 0; i < servi.length; i++) {
                         const service_provider = await db.collection('usuarios').doc(`${servi[i].id_service_provider}`).get()
                         const contractor = await db.collection('usuarios').doc(`${servi[i].id_contractor}`).get()

                         servi[i].service_provider_name = service_provider.data().name
                         servi[i].contractor_name = contractor.data().name
                    }
                    return servi
               }
               const returnServices = await populate(serv_contr)
               res.status(200).send(returnServices)


          } catch (e) {
               console.log(e)
               res.status(500).end(e)
          }
     })
});

//Buscar pedidos por Prestadores de serviço
exports.servicesRequestsByProviders = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               //status: COMFIRMADO - AGUARDANDO CONFIRMACÃO - RECUSADO
               var date_start = ''
               var date_end = ''
               var date = new Date();
               var firstDayMonth = new Date(date.getFullYear(), date.getMonth(), 1).getTime()
               var lastDayMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime()

               var start = new Date(req.body.date_start).getTime()
               var end = new Date(req.body.date_end).getTime()

               date_start = start ? start : firstDayMonth
               date_end = end ? end : lastDayMonth

               const buys = []
               var search = ''
               if (req.body.status) {
                    search = await db.collection('servicosPedidos')
                         .where('id_service_provider', '==', `${req.body.id_service_provider}`)
                         .where('request_date', '>=', `${date_start}`)
                         .where('request_date', '<=', `${date_end}`)
                         .where('status', '==', `${req.body.status}`).get()
               } else {
                    search = await db.collection('servicosPedidos')
                         .where('id_service_provider', '==', `${req.body.id_service_provider}`)
                         .where('request_date', '>=', `${date_start}`)
                         .where('request_date', '<=', `${date_end}`).get()
               }
               search.forEach(serv => {
                    const ser = { id: serv.id, ...serv.data() }
                    buys.push(ser)
               })

               const serv_contr = await Promise.all(buys)

               const populate = async (requestBuy) => {
                    for (var i = 0; i < requestBuy.length; i++) {
                         const event = await db.collection('eventos').doc(`${requestBuy[i].id_event}`).get()
                         const contractor = await db.collection('usuarios').doc(`${requestBuy[i].id_contractor}`).get()
                         const service = await db.collection('servicos').doc(`${requestBuy[i].id_service}`).get()
                         const pais = await db.collection('paises').doc(`${event.data().country}`).get()
                         const state = await db.collection('paises').doc(`${event.data().country}`)
                              .collection('estados').doc(`${event.data().state}`).get()
                         const city = await db.collection('paises').doc(`${event.data().country}`)
                              .collection('estados').doc(`${event.data().state}`).collection('cidades').doc(`${event.data().city}`).get()

                         requestBuy[i].title = service.data().title
                         requestBuy[i].short_description = service.data().short_description
                         requestBuy[i].event_country = pais.data().country
                         requestBuy[i].event_state = state.data().state
                         requestBuy[i].event_city = city.data().city
                         requestBuy[i].event_title = event.data().title
                         requestBuy[i].event_date = event.data().date
                         requestBuy[i].event_hour = event.data().hour
                         requestBuy[i].contractor_name = contractor.data().name
                    }
                    return requestBuy
               }
               const returnBuys = await populate(serv_contr)

               res.status(200).send(returnBuys)


          } catch (e) {
               console.log(e)
               res.status(500).end(e)
          }
     })
});

//Busca todos os serviços de um prestador de serviços
exports.servicesByProvider = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const services = []
               const resp = await db.collection('servicos').where('id_service_provider', '==', req.query.id_service_provider).get()
               resp.forEach(serv => {
                    const ser = { id: serv.id, ...serv.data() }
                    services.push(ser)
               })
               res.status(200).send(services)
          } catch (e) {
               console.log(e)
               res.status(500).end(e)
          }
     })
});

//Busca todos os pedidos de um prestador de serviços
exports.requestService = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const d = new Date()
               const date = new Date(`${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`).getTime()
               const request = {
                    id_service: req.body.id_service,
                    title: req.body.title,
                    description: req.body.description,
                    id_event: req.body.id_event,
                    id_contractor: req.body.id_contractor,
                    id_service_provider: req.body.id_service_provider,
                    request_date: date,
                    annotation: '',
                    status: 'AGUARDANDO APROVAÇÃO'
               }
               await db.collection('sevicosPedidos').add(request)
               res.status(200).send('Serviço pedido com sucesso!')
          } catch (e) {
               console.log(e)
               res.status(500).end(e)
          }
     })
});

//Atualiza o pedido, o prestador de serviço pode aceitar ou recusar o pedido
exports.updateRequest = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const request = {
                    annotation: req.body.annotation || '',
                    status: req.body.status
               }
               await db.collection('sevicosPedidos').update(request)
               res.status(200).send('Serviço atualizado com sucesso!')
          } catch (e) {
               console.log(e)
               res.status(500).end(e)
          }
     })
});



//Buscar serviços por Prestador
exports.getServicesByProvider = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const country = req.body.country
               const state = req.body.state
               const city = req.body.city
               const category = req.body.category || ''
               const status = req.body.status || 'ATIVO'
               var last = ''
               const limit = 2
               var search = ''
               const services = []
               if (req.body.category) {
                    search = db.collection('servicos')
                         .where('country', '==', `${country}`)
                         .where('state', '==', `${state}`)
                         .where('city', '==', `${city}`)
                         .where('id_category', '==', `${category}`)
                         .where('status', '==', `${status}`)
                         .orderBy('date_modified', 'desc')
                         .limit(limit)

               } else {
                    search = db.collection('servicos')
                         .where('country', '==', `${country}`)
                         .where('state', '==', `${state}`)
                         .where('city', '==', `${city}`)
                         .where('status', '==', `${status}`)
                         .orderBy('date_modified', 'desc')
                         .limit(limit)
               }

               if (!last) {
                    var resp = await search.get()
                    last = resp.docs.length > 0 ? resp.docs[0].data().date_modified : ''
               }

               var respo = await search.startAt(last).get()


               respo.forEach(serv => {
                    var short_description = `${serv.description.slice(0, 50)}...`
                    serv.short_description = short_description
                    const ser = { id: serv.id, ...serv.data() }
                    services.push(ser)
               })

               const servs = await Promise.all(services)

               const populate = async (servi) => {
                    for (var i = 0; i < servi.length; i++) {
                         const category = await db.collection('categorias').doc(`${servi[i].id_category}`).get()
                         const provider = await db.collection('usuarios').doc(`${servi[i].id_service_provider}`).get()

                         servi[i].category_name = category.data().category
                         servi[i].provider_name = provider.data().name
                         servi[i].company_name = provider.data().company_name
                    }

                    return servi
               }
               const returnServices = await populate(servs)
               console.log(returnServices)

               var next = search.docs.length > 0 ? search.docs[search.docs.length - 1].data().date_modified : last
               var more = search.docs.length > 0 ? true : false
               res.status(200).send({ services: returnServices, last: next, loadMore: more })

          } catch (e) {
               console.log(e)
               res.status(500).end("" + e)
          }
     })
});
//Buscar serviços para o evento ***********Ainda falta implementar
exports.getServices = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const country = req.body.country
               const state = req.body.state
               const city = req.body.city
               const category = req.body.category || ''
               const status = req.body.status || 'ATIVO'
               var last = req.body.last.date_modified || ''
               const limit = 2
               var search = ''
               const services = []
               if (req.body.category) {
                    search = db.collection('servicos')
                         .where('country', '==', `${country}`)
                         .where('state', '==', `${state}`)
                         .where('city', '==', `${city}`)
                         .where('id_category', '==', `${category}`)
                         .where('status', '==', `${status}`)
                         .orderBy('date_modified', 'desc')
                         .limit(limit)

               } else {
                    search = db.collection('servicos')
                         .where('country', '==', `${country}`)
                         .where('state', '==', `${state}`)
                         .where('city', '==', `${city}`)
                         .where('status', '==', `${status}`)
                         .orderBy('date_modified', 'desc')
                         .limit(limit)
               }

               if (!last) {
                    var resp = await search.get()
                    last = resp.docs.length > 0 ? resp.docs[0].data().date_modified : ''
               }
               var respo = await search.startAt(last).get()

               respo.forEach(serv => {
                    const ser = { id: serv.id, ...serv.data() }
                    services.push(ser)
               })

               const servs = await Promise.all(services)

               const populate = async (servi) => {
                    for (var i = 0; i < servi.length; i++) {
                         const category = await db.collection('categorias').doc(`${servi[i].id_category}`).get()
                         const provider = await db.collection('usuarios').doc(`${servi[i].id_service_provider}`).get()

                         servi[i].category_name = category.data().category
                         servi[i].provider_name = provider.data().name
                         servi[i].company_name = provider.data().company_name
                    }

                    return servi
               }
               const returnServices = await populate(servs)

               var id_last = respo.docs.length > 0 ? respo.docs[respo.docs.length - 1].id : ''
               var dados = respo.docs.length > 0 ? respo.docs[respo.docs.length - 1].data() : {}
               var next = { id: id_last, ...dados }
               var more = respo.docs.length > 1 ? true : false
               res.status(200).send({ services: returnServices, last: next, loadMore: more })

          } catch (e) {
               console.log(e)
               res.status(500).end("" + e)
          }
     })
});


//Contratar Serviços o pedido só será finalizado quando o prestador aceitar o pedido
exports.buyService = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               var balance = await getBalanceSafeBoxe(req.body.id_event)
               if (balance < parseFloat(req.body.value)) {
                    res.status(500).send('Saldo insuficiente no cofre do evento!')
                    return
               }
               const provider = {
                    id_event: req.body.id_event,
                    type: 'CREDITO',
                    value: req.body.value,
                    description: req.body.title,
                    date: new Date().getTime()
               }
               const safeBox = {
                    id_user_sender: req.body.id_contractor,
                    id_user_receiver: req.body.id_service_provider,
                    type: 'DEBITO',
                    value: req.body.value,
                    description: req.body.title,
                    date: new Date().getTime()
               }

               var date = new Date().getTime()
               var description = req.body.description || ''
               var s_desciption = `${description.slice(0, 50)}...`

               const provid = await db.collection('usuarios').doc(`${req.body.req.body.id_service_provider}`).collection('movimentacoes_carteira').add(provider)
               const safe_box = await db.collection('usuarios').doc(`${req.body.id_event}`).collection('movimentacoes_cofre').add(safeBox)


               var service = {
                    id_movim_origin: safe_box.id,
                    id_movim_destination: provid.id,
                    id_contractor: req.body.id_contractor,
                    id_service_provider: req.body.id_service_provider,
                    id_event: req.body.id_event,
                    id_service: req.body.id_service,
                    request_date: date,
                    title: req.body.title,
                    description: req.body.description,
                    short_description: s_desciption,
                    value: req.body.value,
                    status: 'AGUARDANDO CONFIRMAÇÃO',
                    annotation: req.body.annotation || ''
               }
               await db.collection('servicosPedidos').add(service)

               res.status(200).send('Pedido realizado com sucesso!')

          } catch (e) {
               console.log(e)
               res.status(500).end("" + e)
          }
     })
});

//Confirmar ou rejetitar a compra de um serviço
exports.confirmOrRejectBuy = functions.https.onRequest(async (req, res) => {
     cors(req, res, async () => {
          try {
               const new_status = req.body.resp === 'ACCEPT' ? 'CONFIRMADO' : 'RECUSADO'
               const update = { status: new_status, annotation: req.body.annotate || '' }

               if (req.body.resp === 'REJECT') {
                    await db.collection('eventos').doc(`${req.body.id_event}`)
                         .collection('movimentacoes_cofre').doc(`${req.body.id_movim_origin}`).update({ value: 0.0 })

                    await db.collection('usuarios').doc(`${req.body.id_service_provider}`)
                         .collection('movimentacoes_carteira').doc(`${req.body.id_movim_destination}`).update({ value: 0.0 })
               }

               await db.collection('servicosPedidos').doc(`${req.body.id}`).update(update)

               res.status(200).send('Atualizado com sucesso!')

          } catch (e) {
               console.log(e)
               res.status(500).end("" + e)
          }
     })
});


//======================================Fim Servicos=========================================================
