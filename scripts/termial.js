/* =========================================================
   NOXVEIL-Xy
   SECURITY TERMINAL ENGINE
========================================================= */

const terminalOutput =
    document.getElementById("terminalOutput");

const terminalCurrentCommand =
    document.getElementById(
        "terminalCurrentCommand"
    );

const packetCounter =
    document.getElementById(
        "packetCounter"
    );

const eventCounter =
    document.getElementById(
        "eventCounter"
    );

const blockedCounter =
    document.getElementById(
        "blockedCounter"
    );

const trafficValue =
    document.getElementById(
        "trafficValue"
    );


/* =========================================================
   VARIABLES
========================================================= */

let packets = 1284;

let events = 17;

let blocked = 3;


/* =========================================================
   COMMANDS
========================================================= */

const commands = [

    "nmap -sS 192.168.1.20",

    "tcpdump -i eth0",

    "ss -tulpn",

    "ip addr show",

    "ip neigh show",

    "iptables -L -n -v",

    "systemctl status firewall",

    "journalctl -u ssh",

    "python3 network_monitor.py",

    "./security_monitor --analyze",

    "grep 'Failed password' /var/log/auth.log",

    "netstat -ant"

];


/* =========================================================
   SECURITY EVENTS
========================================================= */

const securityEvents = [

    {
        type: "scan",

        prefix: "[SCAN]",

        text:
            "Scanning network interfaces..."
    },

    {
        type: "scan",

        prefix: "[SCAN]",

        text:
            "Enumerating active hosts..."
    },

    {
        type: "scan",

        prefix: "[SCAN]",

        text:
            "Analyzing TCP endpoints..."
    },

    {
        type: "success",

        prefix: "[OK]",

        text:
            "Interface eth0 is operational"
    },

    {
        type: "success",

        prefix: "[OK]",

        text:
            "Firewall rules loaded"
    },

    {
        type: "success",

        prefix: "[OK]",

        text:
            "SSH monitoring active"
    },

    {
        type: "warning",

        prefix: "[WARN]",

        text:
            "Unusual traffic pattern detected"
    },

    {
        type: "warning",

        prefix: "[WARN]",

        text:
            "Multiple connection attempts observed"
    },

    {
        type: "danger",

        prefix: "[ALERT]",

        text:
            "SYN scan detected from 192.168.1.47"
    },

    {
        type: "danger",

        prefix: "[BLOCK]",

        text:
            "Connection dropped by firewall"
    },

    {
        type: "danger",

        prefix: "[ALERT]",

        text:
            "Suspicious ARP activity detected"
    },

    {
        type: "success",

        prefix: "[SECURE]",

        text:
            "Threat contained successfully"
    }

];


/* =========================================================
   INITIAL LOG
========================================================= */

const initialLogs = [

    [
        "Security terminal initialized",
        "[BOOT]",
        "success"
    ],

    [
        "Loading monitoring modules...",
        "[INIT]",
        ""
    ],

    [
        "Interface eth0 detected",
        "[OK]",
        "success"
    ],

    [
        "Firewall subsystem connected",
        "[OK]",
        "success"
    ],

    [
        "Packet inspection engine started",
        "[INIT]",
        ""
    ],

    [
        "Network traffic monitoring enabled",
        "[LIVE]",
        "scan"
    ],

    [
        "Awaiting network events...",
        "[WAIT]",
        ""
    ]

];


/* =========================================================
   CURRENT TIME
========================================================= */

function getTime() {

    return new Date()
        .toLocaleTimeString(
            "en-US",
            {
                hour12: false
            }
        );

}


/* =========================================================
   ADD LINE
========================================================= */

function addTerminalLine(
    message,
    prefix = "[INFO]",
    type = ""
) {

    const line =
        document.createElement("div");


    line.className =
        `terminal-line ${type}`;


    const time =
        document.createElement("span");

    time.className =
        "terminal-time";

    time.textContent =
        getTime();


    const prefixElement =
        document.createElement("span");

    prefixElement.className =
        "terminal-prefix";

    prefixElement.textContent =
        prefix;


    const text =
        document.createElement("span");

    text.className =
        "terminal-message";

    text.textContent =
        message;


    line.appendChild(time);

    line.appendChild(prefixElement);

    line.appendChild(text);


    terminalOutput.appendChild(line);


    /*
        Максимум строк,
        чтобы DOM не разрастался.
    */

    while (
        terminalOutput.children.length > 23
    ) {

        terminalOutput.removeChild(
            terminalOutput.firstChild
        );

    }

}


/* =========================================================
   TYPE COMMAND
========================================================= */

function typeCommand(command) {

    return new Promise(resolve => {

        terminalCurrentCommand.textContent =
            "";

        let index = 0;


        const interval =
            setInterval(() => {

                terminalCurrentCommand.textContent +=
                    command[index];


                index++;


                if (
                    index >= command.length
                ) {

                    clearInterval(interval);

                    resolve();

                }

            }, 32);

    });

}


/* =========================================================
   ADD RANDOM EVENT
========================================================= */

function addRandomSecurityEvent() {

    const event =
        securityEvents[
            Math.floor(
                Math.random() *
                securityEvents.length
            )
        ];


    addTerminalLine(
        event.text,
        event.prefix,
        event.type
    );


    events++;


    if (
        event.type === "danger"
    ) {

        blocked++;

    }


    updateCounters();

}


/* =========================================================
   COUNTERS
========================================================= */

function updateCounters() {

    packetCounter.textContent =
        String(packets)
            .padStart(6, "0");


    eventCounter.textContent =
        String(events)
            .padStart(5, "0");


    blockedCounter.textContent =
        String(blocked)
            .padStart(5, "0");

}


/* =========================================================
   TRAFFIC
========================================================= */

function updateTraffic() {

    const value =
        Math.floor(
            Math.random() * 35
        ) + 55;


    trafficValue.textContent =
        `${value}%`;

}


/* =========================================================
   COMMAND EXECUTION
========================================================= */

async function executeCommand() {


    /*
        Выбираем случайную команду.
    */

    const command =
        commands[
            Math.floor(
                Math.random() *
                commands.length
            )
        ];


    /*
        Печатаем её
        символ за символом.
    */

    await typeCommand(command);


    await wait(400);


    /*
        Переносим команду
        в историю терминала.
    */

    addTerminalLine(
        command,
        ">",
        "command"
    );


    terminalCurrentCommand.textContent =
        "";


    await wait(300);


    /*
        Генерируем события
        после выполнения.
    */

    const eventCount =
        Math.floor(
            Math.random() * 3
        ) + 2;


    for (
        let i = 0;
        i < eventCount;
        i++
    ) {

        addRandomSecurityEvent();


        packets +=
            Math.floor(
                Math.random() * 35
            ) + 10;


        updateCounters();

        updateTraffic();


        await wait(
            Math.floor(
                Math.random() * 500
            ) + 250
        );

    }

}


/* =========================================================
   WAIT
========================================================= */

function wait(milliseconds) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


/* =========================================================
   INITIALIZE TERMINAL
========================================================= */

initialLogs.forEach(
    ([message, prefix, type]) => {

        addTerminalLine(
            message,
            prefix,
            type
        );

    }
);


/* =========================================================
   PACKET ACTIVITY
========================================================= */

setInterval(() => {

    packets +=
        Math.floor(
            Math.random() * 12
        ) + 1;


    updateCounters();

}, 1000);


/* =========================================================
   TRAFFIC ACTIVITY
========================================================= */

setInterval(() => {

    updateTraffic();

}, 1200);


/* =========================================================
   TERMINAL LOOP
========================================================= */

async function terminalLoop() {

    while (true) {

        await executeCommand();

        await wait(
            Math.floor(
                Math.random() * 700
            ) + 700
        );

    }

}


terminalLoop();


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop =
    document.querySelector(
        '.footer-bottom a[href="#top"]'
    );


if (backToTop) {

    backToTop.addEventListener(
        "click",
        event => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}