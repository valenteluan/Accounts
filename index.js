// modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// modulos internos
const fs = require('fs')

operation()

function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair',
        ]
    }])
        .then(answer => {
            const action = answer['action']

            if (action === 'Criar Conta') {
                createAccount()
            } else if (action === 'Consultar Saldo') {
                getAccountBalance()
            } else if (action === 'Depositar') {
                deposit()
            } else if (action === 'Sacar') {
                withdraw()
            } else if (action === 'Sair') {
                console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
                process.exit()
            }

        })
        .catch(err => console.log(err))
}

// Criando conta

function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildAccount()
}

function buildAccount() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para sua conta:'
        }
    ]).then(answer => {
        const accountName = answer['accountName']

        console.info(accountName)

        // Verificar se o banco de dados existe e se não existir criar
        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        // Verifica se o nome da conta já existe
        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))
            buildAccount()
            return
        }

        // Cria a conta
        fs.writeFileSync(`accounts/${accountName}.json`,
            '{"balance": 0}',
            function (err) {
                console.log(err)
            })

        console.log(chalk.green('Parabéns, sua conta foi criada!'))
        operation()

    }).catch(err => console.log(err))
}

// Depositar valor em conta
function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
        .then(answer => {
            const accountName = answer['accountName']

            if (!checkAccount(accountName)) {
                return deposit()
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Quanto você deseja depositar'
                }
            ]).then((answer) => {
                const amount = answer['amount']
                addAmount(accountName, amount)
                operation()
            }).catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}

// Função para verificar se a conta existe
function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }

    return true
}

// Função de adicionar o valor
function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.bold('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
}

// Função para pegar a conta
function getAccount(accountName) {
    const accoutJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accoutJSON)
}

// Funçao de consultar saldo
function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
        .then((answer) => {
            const accountName = answer["accountName"]

            // Verifica se a conta existe
            if (!checkAccount(accountName)) {
                return getAccountBalance()
            }

            const accountData = getAccount(accountName)
            console.log(chalk.bgBlue.black(`Olá, o saldo da sua conta é de ${accountData.balance}!`))
            operation()
        })
        .catch(err => console.log(err))
}

// Função para sacar
function withdraw() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto deseja sacar?'
            }
        ]).then((answer) => {
            const amount = answer['amount']

            removeAmount(accountName, amount)
        }).catch(err => console.log(err))
    })
        .catch(err => console.log(err))

}

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return withdraw()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor indisponível!'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount) 

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Saque no valor de ${amount} realizado com sucesso!`))
    operation()
}