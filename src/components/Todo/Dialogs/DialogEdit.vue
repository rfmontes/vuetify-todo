<template>
    <v-dialog
      :value="true"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Editar task
        </v-card-title>
        <v-card-text>
            Editar titulo da Task:
            <v-text-field 
              v-model="taskTitle" 
              @keyup.enter="saveTask"
            />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="$emit('close')"
            text
          >
            Cancelar
          </v-btn>
          <v-btn
            @click="saveTask"
            :disabled="invalidTaskTitle"
            color="red darken-1"
            text
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: ['task'],
  data() {
    return {
      taskTitle: null
    }
  },
  mounted() {
    this.taskTitle = this.task.title
  },
  computed: {
    invalidTaskTitle() {
      return !this.taskTitle || this.taskTitle === this.task.title
    }
  },
  methods: {
    saveTask() {
      if (!this.invalidTaskTitle) {
        let payload = {
          id: this.task.id,
          title: this.taskTitle
        }
        this.$store.dispatch('updateTask', payload)
        this.$emit('close')
      }
    }
  }
}
</script>

<style>

</style>