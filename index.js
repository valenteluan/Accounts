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

            } else if (action === 'Depositar') {
                deposit()
            } else if (action === 'Sacar') {

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
            name: 'accoutName',
            message: 'Digite um nome para sua conta:'
        }
    ]).then(answer => {
        const accoutName = answer['accoutName']

        console.info(accoutName)

        // Verificar se o banco de dados existe e se não existir criar
        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        // Verifica se o nome da conta já existe
        if (fs.existsSync(`accounts/${accoutName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))
            buildAccount()
            return
        }

        // Cria a conta
        fs.writeFileSync(`accounts/${accoutName}.json`,
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
            name: 'accoutName',
            message: 'Qual o nome da sua conta?'
        }
    ])
        .then(answer => {
            const accoutName = answer['accoutName']

            if (!checkAccount(accoutName)) {
                return deposit()
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Quanto você deseja depositar'
                }
            ]).then((answer) => {
                const amount = answer['amount']
                addAmount(accoutName, amount)
                operation()
            }).catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}

// Função para verificar se a conta existe
function checkAccount(accoutName) {
    if (!fs.existsSync(`accounts/${accoutName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }

    return true
}

// Função de adicionar o valor
function addAmount(accoutName, amount) {
    const accountData = getAccount(accoutName)

    if (!amount) {
        console.log(chalk.bgRed.bold('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accoutName}.json`, 
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
}

// Função para pegar a conta
function getAccount(accoutName) {
    const accoutJSON = fs.readFileSync(`accounts/${accoutName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accoutJSON)
}