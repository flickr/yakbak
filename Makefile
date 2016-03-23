hooks: .git/hooks/pre-commit
hooks: .git/hooks/pre-push

.git/hooks/pre-commit: hook.sh
	cp $< $@

.git/hooks/pre-push: hook.sh
	cp $< $@
