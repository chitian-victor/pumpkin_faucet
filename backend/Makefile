# include .env
include .real_env # 只有部署到真实环境才需要，否则注释掉
	
init:
	@echo "init all..."
	make deploy_token
	make deploy_faucet
	make mint
	make approve_faucet
	make owner_deposit

# 前面的 init 关联的都是 foundry 自带的公钥账户，如果相关联自己的账户，可以用下面的命令进行初始化 ETH
balance_init:
	@echo "init balance(100eth) of metamask..."
	cast rpc anvil_setBalance $(个人账户地址) 0x56BC75E2D63100000
	@echo "再手动发起一次转账，用这个触发一下 metamask 的更新"
	cast send --rpc-url http://127.0.0.1:8545 --private-key $(任意一个有 eth 的私钥) $(目标个人账户地址) --value 10000000000000000000

######## TEST STEPS ##########
deploy_token:
	@echo "deploy token contract..."
	forge create  --broadcast src/PumpkinToken.sol:PumpkinToken --private-key $(OWNER_PRIVATE_KEY)  --constructor-args $(OWNER_ADDRESS)

deploy_faucet:
	@echo "deploy faucet contract..."
	forge create  --broadcast src/PumpkinFaucet.sol:PumpkinFaucet --private-key $(OWNER_PRIVATE_KEY)  --constructor-args $(TOKEN_ADDRESS) $(DRIP_INTERVAL) $(DRIP_LIMIT) 

mint:
	@echo "mint tokens..."
	cast send $(TOKEN_ADDRESS) "mint(uint256)" $(MINT_AMOUNT) --private-key $(OWNER_PRIVATE_KEY)

balance_of_owner:
	@echo "balance of owner..."
	cast call $(TOKEN_ADDRESS) "balanceOf(address)(uint256)" $(OWNER_ADDRESS) --private-key $(OWNER_PRIVATE_KEY)

approve_faucet:
	@echo "approve faucet contract..."
	cast send $(TOKEN_ADDRESS) "approve(address,uint256)" $(FAUCET_ADDRESS) $(DEPOSIT_AMOUNT) --private-key $(OWNER_PRIVATE_KEY)

owner_deposit:
	@echo "deposit tokens..."
	cast send $(FAUCET_ADDRESS) "deposit(uint256)" $(DEPOSIT_AMOUNT) --private-key $(OWNER_PRIVATE_KEY)

balance_of_faucet:
	@echo "balance of faucet..."
	cast call $(TOKEN_ADDRESS) "balanceOf(address)(uint256)" $(FAUCET_ADDRESS) --private-key $(USER_PRIVATE_KEY)

drip:
	@echo "drip 1 token..."
	cast send $(FAUCET_ADDRESS) "drip(uint256)" $(DRIP_AMOUNT) --private-key $(USER_PRIVATE_KEY)

last_drip_time:
	@echo "get last drip time..."
	cast call $(FAUCET_ADDRESS) "lastDripTime(address)(uint256)" $(USER_ADDRESS) --private-key $(USER_PRIVATE_KEY)

balance_of_user:
	@echo "balance of faucet..."
	cast call $(TOKEN_ADDRESS) "balanceOf(address)(uint256)" $(USER_ADDRESS) --private-key $(USER_PRIVATE_KEY)


get_dripLimit:
	@echo "get drip limit of faucet..."
	cast call $(FAUCET_ADDRESS) "dripLimit()(uint256)"  --private-key $(OWNER_ADDRESS)

balance_of_owner_eth:
	@echo "balance of faucet..."
	cast balance $(OWNER_ADDRESS)



# ----- 以下是在测试网上面执行的命令 -----
deploy_token_sepolia:
	@echo "deploy token contract to sepolia..."
	forge create --broadcast \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--private-key $(REAL_PRIVATE_KEY) \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		--verify \
		src/PumpkinToken.sol:PumpkinToken \
		--constructor-args $(REAL_ADDRESS)

deploy_faucet_sepolia:
	@echo "deploy faucet contract to sepolia..."
	forge create --broadcast \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--private-key $(REAL_PRIVATE_KEY) \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		--verify \
		src/PumpkinFaucet.sol:PumpkinFaucet \
		--constructor-args $(REAL_TOKEN_ADDRESS) $(REAL_DRIP_INTERVAL) $(REAL_DRIP_LIMIT)

mint_sepolia:
	@echo "mint tokens to sepolia..."
	cast send $(REAL_TOKEN_ADDRESS) "mint(uint256)" $(REAL_MINT_AMOUNT) \
  --rpc-url $(SEPOLIA_RPC_URL) \
  --private-key $(REAL_PRIVATE_KEY)


approve_faucet_sepolia:
	@echo "approve faucet contract to sepolia..."
	cast send $(REAL_TOKEN_ADDRESS) "approve(address,uint256)" $(REAL_FAUCET_ADDRESS) $(REAL_DEPOSIT_AMOUNT) \
	--rpc-url $(SEPOLIA_RPC_URL) \
	--private-key $(REAL_PRIVATE_KEY)

owner_deposit_sepolia:
	@echo "deposit tokens to sepolia..."
	cast send $(REAL_FAUCET_ADDRESS) "deposit(uint256)" $(REAL_DEPOSIT_AMOUNT) \
	--rpc-url $(SEPOLIA_RPC_URL) \
	--private-key $(REAL_PRIVATE_KEY)

balance_of_owner_sepolia:
	@echo "balance of owner from sepolia..."
	cast call $(REAL_TOKEN_ADDRESS) "balanceOf(address)(uint256)" $(REAL_ADDRESS) \
	--rpc-url $(SEPOLIA_RPC_URL) \
	--private-key $(REAL_PRIVATE_KEY)

balance_of_faucet_sepolia:
	@echo "balance of faucet from sepolia..."
	cast call $(REAL_TOKEN_ADDRESS) "balanceOf(address)(uint256)" $(REAL_FAUCET_ADDRESS) \
	--rpc-url $(SEPOLIA_RPC_URL) \
	--private-key $(REAL_PRIVATE_KEY)
