<template>

    <div class="signinwithsui_dialog" v-if="isActive">
        <div class="signinwithsui_dialog_backdrop" @click="onBackdrop"></div>
        <div class="signinwithsui_dialog_inner" :class="{signinwithsui_dialog_inner_active: isVisible}">
            <div class="signinwithsui_dialog_inner_card">
                
                <div class="signinwithsui_dialog_list">

                    <template v-for="(adapter, index) in adapters" v-bind:key="index">

                        <div class="signinwithsui_dialog_item" :class="{signinwithsui_dialog_item_disabled: adapter.isDefault}" @click="onAdapterClick(adapter)" v-if="adapter.isDefault || adapter.okForSui">
                            <div class="signinwithsui_dialog_item_column signinwithsui_dialog_item_icon">
                                <!-- <img loading="lazy" fetchpriority="auto" aria-hidden="true" draggable="false" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiByeD0iMTYiIGZpbGw9IiM2RkJDRjAiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMC40MjEzIDUyLjc4MzhDMjMuNjQ5NiA1OC4zNzYgMjkuNDMyMSA2MS43MTQyIDM1Ljg4ODggNjEuNzE0MkM0Mi4zNDU1IDYxLjcxNDIgNDguMTI3IDU4LjM3NiA1MS4zNTY0IDUyLjc4MzhDNTQuNTg0OCA0Ny4xOTI2IDU0LjU4NDggNDAuNTE2MyA1MS4zNTY0IDM0LjkyNEwzNy43NTI0IDExLjM2MTVDMzYuOTI0MSA5LjkyNzAxIDM0Ljg1MzUgOS45MjcwMSAzNC4wMjUzIDExLjM2MTVMMjAuNDIxMyAzNC45MjRDMTcuMTkyOSA0MC41MTUyIDE3LjE5MjkgNDcuMTkxNSAyMC40MjEzIDUyLjc4MzhaTTMyLjA1NjYgMjIuNTcxM0wzNC45NTcxIDE3LjU0NzRDMzUuMzcxMiAxNi44MzAxIDM2LjQwNjUgMTYuODMwMSAzNi44MjA2IDE3LjU0NzRMNDcuOTc5MSAzNi44NzQ4QzUwLjAyOTEgNDAuNDI1NCA1MC40MTM5IDQ0LjUzNSA0OS4xMzM1IDQ4LjI5NTRDNDkuMDAwMiA0Ny42ODE5IDQ4LjgxMzggNDcuMDU0MiA0OC41NjI2IDQ2LjQyMDFDNDcuMDIxMyA0Mi41MzA0IDQzLjUzNjMgMzkuNTI4OSAzOC4yMDIzIDM3LjQ5ODJDMzQuNTM1MSAzNi4xMDcxIDMyLjE5NDMgMzQuMDYxMyAzMS4yNDMxIDMxLjQxNzFDMzAuMDE4IDI4LjAwODkgMzEuMjk3NiAyNC4yOTI0IDMyLjA1NjYgMjIuNTcxM1pNMjcuMTEwNyAzMS4xMzc5TDIzLjc5ODYgMzYuODc0OEMyMS4yNzQ4IDQxLjI0NTkgMjEuMjc0OCA0Ni40NjQxIDIzLjc5ODYgNTAuODM1M0MyNi4zMjIzIDU1LjIwNjQgMzAuODQxMyA1Ny44MTUgMzUuODg4OCA1Ny44MTVDMzkuMjQxMyA1Ny44MTUgNDIuMzYxNSA1Ni42NjMzIDQ0LjgxODQgNTQuNjA4OEM0NS4xMzg4IDUzLjgwMjEgNDYuMTMxIDUwLjg0OTIgNDQuOTA1MiA0Ny44MDU4QzQzLjc3MyA0NC45OTU0IDQxLjA0ODIgNDIuNzUxOSAzNi44MDYxIDQxLjEzNkMzMi4wMTEgMzkuMzE3MSAyOC44OTU4IDM2LjQ3NzQgMjcuNTQ4NiAzMi42OTg0QzI3LjM2MzEgMzIuMTc4MSAyNy4yMTg5IDMxLjY1NjggMjcuMTEwNyAzMS4xMzc5WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+"> -->
                                <img loading="lazy" fetchpriority="auto" aria-hidden="true" draggable="false" :src="adapter.icon">
                            </div>
                            <div class="signinwithsui_dialog_item_column signinwithsui_dialog_item_name">
                                {{ adapter.name }}
                            </div>
                        </div>

                    </template>

                </div>
            </div>
        </div>

    </div>

</template>
<style scoped src="./style.css">
</style>
<script>

export default {
	name: 'SignInWithSuiDialog',
    emits: ['click','hidden'],
	props: {
        adapters: {
            type: Array,
            default() { return []; },
        },
        showing: {
            type: Boolean,
            default: false,
        }
	},
	data() {
		return {
            isActive: false,
            isVisible: false,
		}
	},
	watch: {
        showing: function() {
            if (this.showing) {
                this.show();
            } else {
                this.hide();
            }
        },
	},
	computed: {
	},
	components: {
	},
	methods: {
        onAdapterClick(adapter) {
            this.$emit('click', adapter);
        },
        show() {
            this.isActive = true;
            setTimeout(()=>{
                this.isVisible = true;
            }, 10);
        },
        hide() {
            this.isVisible = false;
            setTimeout(()=>{
                this.isActive = false;
                this.$emit('hidden');
            }, 300);
        },
        onBackdrop() {
            this.hide();
        },
	},
	beforeMount: function() {
	},
	mounted: async function() {
	},
}
</script>
