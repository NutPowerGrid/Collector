import { config } from "dotenv"
import Nut from "./nut"

config();
const { NUT_IP, NUT_PORT, NUT_UPS_NAME } = process.env
const nut = new Nut({ NUT_UPS_NAME, NUT_IP, NUT_PORT })

nut.read()

