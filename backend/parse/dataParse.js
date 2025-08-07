import moment from "moment-timezone";
moment.tz.setDefault("Asia/Seoul");

const ConvertBase = (num) => ({
    from: (baseFrom) => ({
        to: (baseTo) => parseInt(num, baseFrom).toString(baseTo)
    })
});

const hex2dec = (num) => ConvertBase(num).from(16).to(10);

const lpad = (str, padLen, padStr) => {
    str = String(str);
    padStr = String(padStr);
    while (str.length < padLen) {
        str = padStr + str;
    }
    return str.substring(0, padLen);
};

const convertHexToDate = (hexValue) => {
    const decValue = parseInt(hexValue, 16);
    const dateTimeValue = new Date(decValue * 1000);
    const year = dateTimeValue.getFullYear();
    const month = lpad(dateTimeValue.getMonth() + 1, 2, '0');
    const day = lpad(dateTimeValue.getDate(), 2, '0');
    const hours = lpad(dateTimeValue.getHours(), 2, '0');
    const minutes = lpad(dateTimeValue.getMinutes(), 2, '0');
    const seconds = lpad(dateTimeValue.getSeconds(), 2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const parseMQTTMessage = (topic, message) => {
    try {
        const jsonData = JSON.parse(message.toString());
        console.log("Parsing data as JSON...");
        return {
            rkey: "rkey",
            carId: "01222580211",
             carName: "K3 195호4070",
            latitude: jsonData.lat / 1000000,
            longitude: jsonData.lon / 1000000,
            speed: jsonData.speed,
            senddt: moment().unix(), 
        };
    } catch (e) {
        console.log("Data is not JSON, falling back to original parsing logic...");
    }

    const topicParts = topic.split("/");
    if (topicParts[1] === "") {
        return null;
    }

    const machineType = topicParts[4];
    
    if (topicParts[3] === "COLD") {
        return parseColdData(topicParts, message);
    } else {
        const dataArray = parseMessageToDecimalArray(message, machineType);
        if (!dataArray || dataArray.length === 0) {
            return null;
        }
        return parseRegularData(topicParts, dataArray);
    }
};

const parseMessageToDecimalArray = (message, machineType) => {
    const messageHex = Buffer(message).toString('hex');
    
    const messageString = message.toString('utf8').replace(/\s/g, '');

    const source = (machineType === "RS232" || machineType === "RS485") ? messageHex : messageString;
    
    const rmg = [];
    let msg = "";
    let cnt = 0;

    for (let i = 0; i < source.length; i++) {
        cnt++;
        msg += source[i];
        if (cnt === 2) {
            rmg.push(hex2dec(msg));
            msg = "";
            cnt = 0;
        }
    }
    return rmg;
};

const parseColdData = (topicParts, message) => {
    const messageString = message.toString();
    const topic_temp = messageString.split(";");
    
    const data = {};
    for (const item of topic_temp) {
        if (item.includes('TM=')) data.yymmdd = convertHexToDate(item.replace('TM=', '')).substring(0,8);
        if (item.includes('TM=')) data.hhnnss = convertHexToDate(item.replace('TM=', '')).substring(8,14);
        if (item.includes('T1=')) data.temperature1 = item.replace('T1=', '');
        if (item.includes('T2=')) data.temperature2 = item.replace('T2=', '');
        if (item.includes('LAT=')) data.lat = item.replace('LAT=', '');
        if (item.includes('LNG=')) data.lon = item.replace('LNG=', '');
        if (item.includes('CRS=')) data.heading = item.replace('CRS=', '');
        if (item.includes('SPD=')) data.speed = item.replace('SPD=', '');
    }

    return {
        rkey: topicParts[1],
        carId: topicParts[2],
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
        speed: parseFloat(data.speed),
        heading: parseFloat(data.heading),
        temperature1: parseFloat(data.temperature1),
        expiredt: moment().add(1, 'years').format('YYYYMMDDHHmmss'),
        senddt: moment().format('YYYYMMDD'),
    };
};

const parseRegularData = (topicParts, dataArray) => {
    const MaxNorthPosition = 8388607;
    const MaxSouthPosition = 8388608;
    const MaxEastPosition = 838860;
    const MaxWestPosition = 838860;

    let latitude = (Number(dataArray[7]) << 16) + (Number(dataArray[8]) << 8) + Number(dataArray[9]);
    let longitude = (Number(dataArray[10]) << 16) + (Number(dataArray[11]) << 8) + Number(dataArray[12]);

    const lat_f = latitude >= 0 ? (latitude / MaxNorthPosition) * 90 : (latitude / MaxSouthPosition) * 90;
    const lon_f = longitude >= 0 ? (longitude / MaxEastPosition) * 180 : (longitude / MaxWestPosition) * 180;

    const carSpeed = Number(dataArray[13]);
    const carHeading = Number(dataArray[15]);
    const carHeading2 = Number(dataArray[14]);

    const heading = carHeading2 === 1 ? carHeading + 255 : carHeading;

    const yymmdd = "20" + dataArray[0] + lpad(dataArray[1], 2, "0") + lpad(dataArray[2], 2, "0");
    const hhnnss = lpad(dataArray[3], 2, "0") + lpad(dataArray[4], 2, "0") + lpad(dataArray[5], 2, "0");

    const parsedData = {
        rkey: topicParts[1],
        carId: topicParts[2],
        expiredt: moment().add(1, 'years').format('YYYYMMDDHHmmss'),
        defaultLat: lat_f,
        defaultLon: lon_f,
        latitude: lat_f,
        longitude: lon_f,
        senddt: yymmdd,
    };

    return parsedData;
};

export { parseMQTTMessage, convertHexToDate, lpad };