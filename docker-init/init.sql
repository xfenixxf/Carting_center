--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-10-31 03:55:41

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 35063)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    password_hash character varying(200)
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 35062)
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accounts_id_seq OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 219
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- TOC entry 228 (class 1259 OID 35125)
-- Name: kart_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kart_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    price_per_race numeric(10,2) NOT NULL
);


ALTER TABLE public.kart_types OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 35124)
-- Name: kart_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kart_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kart_types_id_seq OWNER TO postgres;

--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 227
-- Name: kart_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kart_types_id_seq OWNED BY public.kart_types.id;


--
-- TOC entry 230 (class 1259 OID 35134)
-- Name: karts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.karts (
    id integer NOT NULL,
    serial_number character varying(50) NOT NULL,
    kart_type_id integer NOT NULL,
    price numeric(10,2) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.karts OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 35133)
-- Name: karts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.karts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.karts_id_seq OWNER TO postgres;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 229
-- Name: karts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.karts_id_seq OWNED BY public.karts.id;


--
-- TOC entry 226 (class 1259 OID 35118)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(200),
    distance real
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 35117)
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_id_seq OWNER TO postgres;

--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 225
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- TOC entry 242 (class 1259 OID 35254)
-- Name: parts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parts (
    id_parts integer NOT NULL,
    name_parts character varying(50) NOT NULL,
    description text,
    quantity integer NOT NULL,
    price real NOT NULL
);


ALTER TABLE public.parts OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 35253)
-- Name: parts_id_parts_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parts_id_parts_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parts_id_parts_seq OWNER TO postgres;

--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 241
-- Name: parts_id_parts_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parts_id_parts_seq OWNED BY public.parts.id_parts;


--
-- TOC entry 224 (class 1259 OID 35104)
-- Name: personnel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personnel (
    id integer NOT NULL,
    account_id integer NOT NULL,
    full_name character varying(200) NOT NULL
);


ALTER TABLE public.personnel OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 35103)
-- Name: personnel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personnel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personnel_id_seq OWNER TO postgres;

--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 223
-- Name: personnel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personnel_id_seq OWNED BY public.personnel.id;


--
-- TOC entry 236 (class 1259 OID 35180)
-- Name: ride_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ride_participants (
    id integer NOT NULL,
    user_id integer NOT NULL,
    ride_id integer NOT NULL,
    team_id integer,
    kart_id integer NOT NULL,
    participant_date date DEFAULT CURRENT_DATE NOT NULL,
    status character varying(20) DEFAULT 'booked'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_ride_participants_status CHECK (((status)::text = ANY ((ARRAY['booked'::character varying, 'cancelled'::character varying, 'attended'::character varying])::text[])))
);


ALTER TABLE public.ride_participants OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 35179)
-- Name: ride_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ride_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ride_participants_id_seq OWNER TO postgres;

--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 235
-- Name: ride_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ride_participants_id_seq OWNED BY public.ride_participants.id;


--
-- TOC entry 234 (class 1259 OID 35158)
-- Name: rides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rides (
    id integer NOT NULL,
    location_id integer NOT NULL,
    ride_data character varying(500),
    ride_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    duration_minutes integer DEFAULT 10 NOT NULL,
    max_participants integer DEFAULT 10 NOT NULL,
    status character varying(20) DEFAULT 'open'::character varying NOT NULL,
    amount_paid numeric(10,2) DEFAULT 0 NOT NULL,
    CONSTRAINT ck_rides_duration CHECK ((duration_minutes > 0)),
    CONSTRAINT ck_rides_max_participants CHECK ((max_participants > 0)),
    CONSTRAINT ck_rides_status CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'closed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.rides OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 35157)
-- Name: rides_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rides_id_seq OWNER TO postgres;

--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 233
-- Name: rides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rides_id_seq OWNED BY public.rides.id;


--
-- TOC entry 218 (class 1259 OID 35054)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 35053)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 232 (class 1259 OID 35150)
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 35149)
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teams_id_seq OWNER TO postgres;

--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 231
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- TOC entry 240 (class 1259 OID 35229)
-- Name: to_maintenance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.to_maintenance (
    id_to integer NOT NULL,
    kart_id integer NOT NULL,
    id_type_to integer NOT NULL,
    id_master integer NOT NULL,
    date date NOT NULL,
    description text,
    is_completed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.to_maintenance OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 35228)
-- Name: to_maintenance_id_to_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.to_maintenance_id_to_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.to_maintenance_id_to_seq OWNER TO postgres;

--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 239
-- Name: to_maintenance_id_to_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.to_maintenance_id_to_seq OWNED BY public.to_maintenance.id_to;


--
-- TOC entry 238 (class 1259 OID 35218)
-- Name: type_to; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_to (
    id integer NOT NULL,
    name_type character varying(50) NOT NULL,
    description text,
    recommended_interval real
);


ALTER TABLE public.type_to OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 35217)
-- Name: type_to_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_to_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_to_id_seq OWNER TO postgres;

--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 237
-- Name: type_to_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_to_id_seq OWNED BY public.type_to.id;


--
-- TOC entry 222 (class 1259 OID 35091)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    account_id integer,
    full_name character varying(200) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 35090)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 244 (class 1259 OID 35263)
-- Name: using_parts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.using_parts (
    id integer NOT NULL,
    parts_id integer NOT NULL,
    to_id integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.using_parts OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 35262)
-- Name: using_parts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.using_parts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.using_parts_id_seq OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 243
-- Name: using_parts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.using_parts_id_seq OWNED BY public.using_parts.id;


--
-- TOC entry 4707 (class 2604 OID 35066)
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- TOC entry 4712 (class 2604 OID 35128)
-- Name: kart_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kart_types ALTER COLUMN id SET DEFAULT nextval('public.kart_types_id_seq'::regclass);


--
-- TOC entry 4713 (class 2604 OID 35137)
-- Name: karts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.karts ALTER COLUMN id SET DEFAULT nextval('public.karts_id_seq'::regclass);


--
-- TOC entry 4711 (class 2604 OID 35121)
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- TOC entry 4729 (class 2604 OID 35257)
-- Name: parts id_parts; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts ALTER COLUMN id_parts SET DEFAULT nextval('public.parts_id_parts_seq'::regclass);


--
-- TOC entry 4710 (class 2604 OID 35107)
-- Name: personnel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel ALTER COLUMN id SET DEFAULT nextval('public.personnel_id_seq'::regclass);


--
-- TOC entry 4722 (class 2604 OID 35183)
-- Name: ride_participants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_participants ALTER COLUMN id SET DEFAULT nextval('public.ride_participants_id_seq'::regclass);


--
-- TOC entry 4717 (class 2604 OID 35161)
-- Name: rides id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rides ALTER COLUMN id SET DEFAULT nextval('public.rides_id_seq'::regclass);


--
-- TOC entry 4706 (class 2604 OID 35057)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4715 (class 2604 OID 35153)
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- TOC entry 4727 (class 2604 OID 35232)
-- Name: to_maintenance id_to; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.to_maintenance ALTER COLUMN id_to SET DEFAULT nextval('public.to_maintenance_id_to_seq'::regclass);


--
-- TOC entry 4726 (class 2604 OID 35221)
-- Name: type_to id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_to ALTER COLUMN id SET DEFAULT nextval('public.type_to_id_seq'::regclass);


--
-- TOC entry 4709 (class 2604 OID 35094)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4730 (class 2604 OID 35266)
-- Name: using_parts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.using_parts ALTER COLUMN id SET DEFAULT nextval('public.using_parts_id_seq'::regclass);


--
-- TOC entry 4947 (class 0 OID 35063)
-- Dependencies: 220
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (id, email, role_id, created_at, password_hash) FROM stdin;
1	admin@karting.ru	1	2026-10-24 03:02:19.104061	$2b$12$UGUEHKpW/W7shurmpNuyju9cRqC2AU39lrgv5c3PzSZTFn4HyFfaW
2	manager@karting.ru	2	2026-10-24 03:02:19.104061	$2b$12$UGUEHKpW/W7shurmpNuyju9cRqC2AU39lrgv5c3PzSZTFn4HyFfaW
3	mechanic@karting.ru	3	2026-10-24 03:02:19.104061	$2b$12$UGUEHKpW/W7shurmpNuyju9cRqC2AU39lrgv5c3PzSZTFn4HyFfaW
4	user@karting.ru	4	2026-10-24 03:02:19.104061	$2b$12$UGUEHKpW/W7shurmpNuyju9cRqC2AU39lrgv5c3PzSZTFn4HyFfaW
8	Krakazabra@mail.com	4	2026-10-30 19:38:15.99963	$2b$12$WuXxE/YDoEYwPO3SxcLhn.h7Rn1oVzMMLPAE5ykiIdWtFMtBvejlm
10	2312@sdasd.sad	3	2026-10-31 02:38:16.896664	$2b$12$Qv6irHjZzd2jyHNhjFl9.OaUS4n9IXr8DjtdSk45v6Fx68z2BstPi
\.


--
-- TOC entry 4955 (class 0 OID 35125)
-- Dependencies: 228
-- Data for Name: kart_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kart_types (id, name, price_per_race) FROM stdin;
1	Взрослый 9 л.с.	800.00
2	Взрослый 13 л.с.	1200.00
3	Детский 6 л.с.	600.00
4	Двухместный	1500.00
\.


--
-- TOC entry 4957 (class 0 OID 35134)
-- Dependencies: 230
-- Data for Name: karts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.karts (id, serial_number, kart_type_id, price, is_active) FROM stdin;
1	K-001	1	800.00	t
2	K-002	1	800.00	t
4	K-004	2	1200.00	t
5	K-12	1	500.00	f
3	K-003	3	600.00	t
\.


--
-- TOC entry 4953 (class 0 OID 35118)
-- Dependencies: 226
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (id, name, address, distance) FROM stdin;
1	Основная трасса	ул. Трассовая, 1	800
3	Крытая арена	пр. Скоростной, 12	600
2	Детская трасса	ул. Трассовая, 1ААА	300
\.


--
-- TOC entry 4969 (class 0 OID 35254)
-- Dependencies: 242
-- Data for Name: parts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parts (id_parts, name_parts, description, quantity, price) FROM stdin;
3	23123	231	123	31
1	Свеча зажигания	NGK CR8E	5	450
2	Тормозные колодки	Передние	11	1800
\.


--
-- TOC entry 4951 (class 0 OID 35104)
-- Dependencies: 224
-- Data for Name: personnel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personnel (id, account_id, full_name) FROM stdin;
1	1	Администратор Системы
2	2	Ольга Иванова
3	3	Сергей Кузнецов
5	10	ывфы
\.


--
-- TOC entry 4963 (class 0 OID 35180)
-- Dependencies: 236
-- Data for Name: ride_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ride_participants (id, user_id, ride_id, team_id, kart_id, participant_date, status, created_at) FROM stdin;
3	4	4	1	1	2026-10-30	booked	2026-10-30 20:00:20.699146
5	4	7	1	1	2026-10-30	booked	2026-10-30 20:00:54.311685
7	4	8	1	1	2026-10-30	booked	2026-10-30 20:20:48.59461
9	4	9	1	5	2026-10-30	booked	2026-10-30 23:26:59.190985
10	4	13	1	1	2026-10-31	booked	2026-10-31 01:39:55.642652
\.


--
-- TOC entry 4961 (class 0 OID 35158)
-- Dependencies: 234
-- Data for Name: rides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rides (id, location_id, ride_data, ride_date, start_time, end_time, duration_minutes, max_participants, status, amount_paid) FROM stdin;
12	1	\N	2222-02-22	16:40:00	18:40:00	120	12	open	0.00
13	1	\N	2125-05-04	18:53:00	21:48:00	175	20	open	800.00
4	1	\N	2026-10-25	12:00:00	12:10:00	10	10	closed	0.00
7	2	\N	2026-10-25	12:00:00	12:10:00	10	10	closed	0.00
8	3	\N	2026-10-25	12:00:00	12:10:00	10	10	closed	0.00
9	2	\N	2026-10-25	12:00:00	12:10:00	10	10	closed	0.00
11	2	\N	1111-11-11	12:43:00	15:37:00	174	15	closed	0.00
10	3	\N	2077-02-05	12:20:00	15:29:00	189	10	open	0.00
\.


--
-- TOC entry 4945 (class 0 OID 35054)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	admin
2	manager
3	mechanic
4	user
\.


--
-- TOC entry 4959 (class 0 OID 35150)
-- Dependencies: 232
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name, is_active) FROM stdin;
1	2131	t
2	Соло	t
\.


--
-- TOC entry 4967 (class 0 OID 35229)
-- Dependencies: 240
-- Data for Name: to_maintenance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.to_maintenance (id_to, kart_id, id_type_to, id_master, date, description, is_completed) FROM stdin;
1	2	1	1	1111-11-11	111	f
\.


--
-- TOC entry 4965 (class 0 OID 35218)
-- Dependencies: 238
-- Data for Name: type_to; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_to (id, name_type, description, recommended_interval) FROM stdin;
1	Замена масла	Замена моторного масла	30
2	Замена шин	Сезонная замена	90
\.


--
-- TOC entry 4949 (class 0 OID 35091)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, account_id, full_name) FROM stdin;
1	4	Иванов Иван Иванович
2	\N	fsfdsf
3	\N	Dhdfhf
4	8	краказябра
5	\N	уцйуйц
6	\N	sdfsdfs
7	\N	131231
\.


--
-- TOC entry 4971 (class 0 OID 35263)
-- Dependencies: 244
-- Data for Name: using_parts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.using_parts (id, parts_id, to_id, quantity) FROM stdin;
2	2	1	10
3	3	1	10
\.


--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 219
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accounts_id_seq', 10, true);


--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 227
-- Name: kart_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kart_types_id_seq', 5, true);


--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 229
-- Name: karts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.karts_id_seq', 5, true);


--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 225
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_id_seq', 4, true);


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 241
-- Name: parts_id_parts_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parts_id_parts_seq', 4, true);


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 223
-- Name: personnel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personnel_id_seq', 5, true);


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 235
-- Name: ride_participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ride_participants_id_seq', 11, true);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 233
-- Name: rides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rides_id_seq', 13, true);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 231
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 2, true);


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 239
-- Name: to_maintenance_id_to_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.to_maintenance_id_to_seq', 2, true);


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 237
-- Name: type_to_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_to_id_seq', 3, true);


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 243
-- Name: using_parts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.using_parts_id_seq', 6, true);


--
-- TOC entry 4740 (class 2606 OID 35069)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 4753 (class 2606 OID 35132)
-- Name: kart_types kart_types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kart_types
    ADD CONSTRAINT kart_types_name_key UNIQUE (name);


--
-- TOC entry 4755 (class 2606 OID 35130)
-- Name: kart_types kart_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kart_types
    ADD CONSTRAINT kart_types_pkey PRIMARY KEY (id);


--
-- TOC entry 4758 (class 2606 OID 35140)
-- Name: karts karts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.karts
    ADD CONSTRAINT karts_pkey PRIMARY KEY (id);


--
-- TOC entry 4760 (class 2606 OID 35142)
-- Name: karts karts_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.karts
    ADD CONSTRAINT karts_serial_number_key UNIQUE (serial_number);


--
-- TOC entry 4751 (class 2606 OID 35123)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4782 (class 2606 OID 35261)
-- Name: parts parts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts
    ADD CONSTRAINT parts_pkey PRIMARY KEY (id_parts);


--
-- TOC entry 4747 (class 2606 OID 35109)
-- Name: personnel personnel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_pkey PRIMARY KEY (id);


--
-- TOC entry 4772 (class 2606 OID 35189)
-- Name: ride_participants ride_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_participants
    ADD CONSTRAINT ride_participants_pkey PRIMARY KEY (id);


--
-- TOC entry 4765 (class 2606 OID 35172)
-- Name: rides rides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_pkey PRIMARY KEY (id);


--
-- TOC entry 4736 (class 2606 OID 35061)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 4738 (class 2606 OID 35059)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4762 (class 2606 OID 35156)
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- TOC entry 4780 (class 2606 OID 35237)
-- Name: to_maintenance to_maintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.to_maintenance
    ADD CONSTRAINT to_maintenance_pkey PRIMARY KEY (id_to);


--
-- TOC entry 4776 (class 2606 OID 35227)
-- Name: type_to type_to_name_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_to
    ADD CONSTRAINT type_to_name_type_key UNIQUE (name_type);


--
-- TOC entry 4778 (class 2606 OID 35225)
-- Name: type_to type_to_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_to
    ADD CONSTRAINT type_to_pkey PRIMARY KEY (id);


--
-- TOC entry 4742 (class 2606 OID 35071)
-- Name: accounts uq_accounts_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT uq_accounts_email UNIQUE (email);


--
-- TOC entry 4749 (class 2606 OID 35111)
-- Name: personnel uq_personnel_account_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT uq_personnel_account_id UNIQUE (account_id);


--
-- TOC entry 4744 (class 2606 OID 35096)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4784 (class 2606 OID 35268)
-- Name: using_parts using_parts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.using_parts
    ADD CONSTRAINT using_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4756 (class 1259 OID 35148)
-- Name: ix_karts_kart_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_karts_kart_type_id ON public.karts USING btree (kart_type_id);


--
-- TOC entry 4766 (class 1259 OID 35213)
-- Name: ix_ride_participants_kart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_ride_participants_kart_id ON public.ride_participants USING btree (kart_id);


--
-- TOC entry 4767 (class 1259 OID 35214)
-- Name: ix_ride_participants_participant_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_ride_participants_participant_date ON public.ride_participants USING btree (participant_date);


--
-- TOC entry 4768 (class 1259 OID 35211)
-- Name: ix_ride_participants_ride_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_ride_participants_ride_id ON public.ride_participants USING btree (ride_id);


--
-- TOC entry 4769 (class 1259 OID 35212)
-- Name: ix_ride_participants_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_ride_participants_team_id ON public.ride_participants USING btree (team_id);


--
-- TOC entry 4770 (class 1259 OID 35210)
-- Name: ix_ride_participants_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_ride_participants_user_id ON public.ride_participants USING btree (user_id);


--
-- TOC entry 4763 (class 1259 OID 35178)
-- Name: ix_rides_ride_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_rides_ride_date ON public.rides USING btree (ride_date);


--
-- TOC entry 4773 (class 1259 OID 35216)
-- Name: ux_ride_participants_ride_kart; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_ride_participants_ride_kart ON public.ride_participants USING btree (ride_id, kart_id) WHERE ((kart_id IS NOT NULL) AND ((status)::text <> 'cancelled'::text));


--
-- TOC entry 4774 (class 1259 OID 35215)
-- Name: ux_ride_participants_ride_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_ride_participants_ride_user ON public.ride_participants USING btree (ride_id, user_id) WHERE ((status)::text <> 'cancelled'::text);


--
-- TOC entry 4745 (class 1259 OID 35102)
-- Name: ux_users_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_users_account_id ON public.users USING btree (account_id) WHERE (account_id IS NOT NULL);


--
-- TOC entry 4785 (class 2606 OID 35072)
-- Name: accounts accounts_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 4788 (class 2606 OID 35143)
-- Name: karts karts_kart_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.karts
    ADD CONSTRAINT karts_kart_type_id_fkey FOREIGN KEY (kart_type_id) REFERENCES public.kart_types(id);


--
-- TOC entry 4787 (class 2606 OID 35112)
-- Name: personnel personnel_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- TOC entry 4790 (class 2606 OID 35205)
-- Name: ride_participants ride_participants_kart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_participants
    ADD CONSTRAINT ride_participants_kart_id_fkey FOREIGN KEY (kart_id) REFERENCES public.karts(id);


--
-- TOC entry 4791 (class 2606 OID 35195)
-- Name: ride_participants ride_participants_ride_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_participants
    ADD CONSTRAINT ride_participants_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id);


--
-- TOC entry 4792 (class 2606 OID 35200)
-- Name: ride_participants ride_participants_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_participants
    ADD CONSTRAINT ride_participants_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- TOC entry 4793 (class 2606 OID 35190)
-- Name: ride_participants ride_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_participants
    ADD CONSTRAINT ride_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4789 (class 2606 OID 35173)
-- Name: rides rides_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- TOC entry 4794 (class 2606 OID 35248)
-- Name: to_maintenance to_maintenance_id_master_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.to_maintenance
    ADD CONSTRAINT to_maintenance_id_master_fkey FOREIGN KEY (id_master) REFERENCES public.personnel(id);


--
-- TOC entry 4795 (class 2606 OID 35243)
-- Name: to_maintenance to_maintenance_id_type_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.to_maintenance
    ADD CONSTRAINT to_maintenance_id_type_to_fkey FOREIGN KEY (id_type_to) REFERENCES public.type_to(id);


--
-- TOC entry 4796 (class 2606 OID 35238)
-- Name: to_maintenance to_maintenance_kart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.to_maintenance
    ADD CONSTRAINT to_maintenance_kart_id_fkey FOREIGN KEY (kart_id) REFERENCES public.karts(id);


--
-- TOC entry 4786 (class 2606 OID 35097)
-- Name: users users_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- TOC entry 4797 (class 2606 OID 35269)
-- Name: using_parts using_parts_parts_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.using_parts
    ADD CONSTRAINT using_parts_parts_id_fkey FOREIGN KEY (parts_id) REFERENCES public.parts(id_parts);


--
-- TOC entry 4798 (class 2606 OID 35274)
-- Name: using_parts using_parts_to_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.using_parts
    ADD CONSTRAINT using_parts_to_id_fkey FOREIGN KEY (to_id) REFERENCES public.to_maintenance(id_to);


-- Completed on 2026-10-31 03:55:42

--
-- PostgreSQL database dump complete
--


