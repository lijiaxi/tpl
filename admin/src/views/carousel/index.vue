
<style lang="stylus" scoped>
.filter-item {
  margin-right: 10px;
}

.filter-iteam1 {
  margin-right: 40px;
}

.dialog-footer {
  text-align: center;
}

/deep/ {
  .el-dialog__header {
    text-align: center;
  }
}

.preview-img {
  max-width: 100%;
}

.icon-drag {
  cursor: move;
}
</style>

<template>
  <div class="app-container calendar-list-container">
    <!-- filter 条件查询 -->
    <div class="filter-container">
      <!-- <el-form label-width="100px" inline label-position='left'>
        <el-form-item label="用户名：">
          <el-input
            clearable
            @keyup.enter.native="handleFilter"
            v-model="listQuery.name"
            style="width: 200px;"
            class="filter-item"
            placeholder="关键字" />
        </el-form-item>
        </el-form-item>
        <el-form-item label="开始日期：">
          <el-date-picker
            v-model="listQuery.startTime"
            type="datetime"
            value-format='yyyy-MM-dd HH:mm:ss'
            placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker
            v-model="listQuery.endTime"
            type="datetime"
            value-format='yyyy-MM-dd HH:mm:ss'
            placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>-->
      <el-button
        class="filter-item"
        icon="el-icon-circle-plus-outline"
        v-waves
        @click="beforOpenDialog(1)"
        type="primary"
      >新增</el-button>
      <el-button
        class="filter-item"
        type="primary"
        v-waves
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        :loading="downloadLoading"
        type="primary"
        v-waves
        icon="el-icon-refresh"
        @click="onRefreash"
      >刷新</el-button>
    </div>
    <!-- table 表格 -->
    <el-table
      :data="list"
      ref="dragTable"
      v-loading="loading.list"
      element-loading-text="给我一点时间~"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="id" prop="id"/>
      <el-table-column align="center" label="标题" prop="title"/>
      <el-table-column align="center" sortable label="展示顺序" prop="priority"/>
      <!-- <el-table-column  align="center" label="管理ID" prop='managerId'/>
      <el-table-column  align="center" label="外部链接">
        <template slot-scope="scope">
          <a  v-if="scope.row.externalLink" :href="scope.row.externalLink" >查看</a>
          <span v-else>-</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="发布状态">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.isRelease === 1">未发布/下架</el-tag>
          <el-tag v-else>上架</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片详情">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-view" @click="beforeView(scope.row.url)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable label="创建时间" prop="ctime"/>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" @click="beforOpenDialog(2, scope.row)" type="primary">编辑</el-button>
          <el-button
            icon="el-icon-open"
            type="warning"
            @click="updateItem(scope.row.id, 1)"
            v-if="scope.row.isRelease === 2"
          >下架</el-button>
          <el-button
            icon="el-icon-turn-off"
            type="primary"
            @click="updateItem(scope.row.id, 2)"
            v-else
          >上架</el-button>
          <el-button icon="el-icon-delete" @click="deleteItem(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="移动">
        <template slot-scope="scope">
          <svg-icon icon-class="drag" class="icon-drag" size="40"/>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.offset"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog v-dragDialog :title="diglogTitle" :visible.sync="dialog.add">
      <el-form :model="addQuery" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addQuery.title" style="width:200px" clearable maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="priority">
          <el-input-number
            v-model="addQuery.priority"
            :step="1"
            :step-strictly="true"
            controls-position="right"
            :min="1"
            :max="99"
          />
        </el-form-item>
        <el-form-item label="图片" prop="url">
          <el-upload
            class="upload-demo"
            :action="$uploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :limit="1"
            :file-list="fileList"
            :data="{'fileName': 'carousel'}"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading.add"
            @click="addtem"
          >确定{{dialogType === 1 ? '添加' : '编辑'}}</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="图片详情" v-dragDialog :visible.sync="dialog.view">
      <div style="text-align:center">
        <img :src="imgUrl" class="preview-img" alt>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tableMixins from "@/mixins/table";
import * as api from "@/service/carousel";
import Sortable from "sortablejs";
export default {
  mixins: [tableMixins],
  name: "carousel",
  data() {
    return {
      total: 0,
      list: null,
      dialogType: 1,
      imgUrl: "",
      loading: {
        list: false,
        add: false,
        download: false
      },
      dialog: {
        add: false,
        view: false
      },
      addQuery: {
        title: "",
        url: "",
        priority: ""
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        url: [{ required: true, message: "请上传图片", trigger: "blur" }],
        priority: [
          { required: true, message: "请输入展示顺序", trigger: "blur" }
        ]
      },
      fileList: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    beforeUpload(file) {
      if (file && file.size) {
        if (file.size > 1024 * 1024) {
          this.$message.warning("只能上传小于1M的图片");
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    handleSuccess(res, file, fileList) {
      this.addQuery.url = res.data;
    },
    handleRemove(file, fileList) {
      this.addQuery.url = "";
    },
    handlePreview() {
      this.imgUrl = url;
      this.dialog.view = true;
    },
    beforeView(url) {
      this.imgUrl = url;
      this.dialog.view = true;
    },
    async fetchData() {
      try {
        this.loading.list = true;
        const { data } = await api.getList(this.listQuery);
        this.list = data.records.map((item, index) => {
          return {
            ...item,
            index: index + 1
          };
        });
        this.total = data.total;
        this.loading.list = false;
        this.$nextTick(() => {
          this.setSort();
        });
      } catch (error) {
        this.loading.list = false;
      }
    },
    deleteItem(id) {
      const h = this.$createElement;
      this.$msgbox({
        title: "提示",
        message: h("p", null, [h("span", null, "确定删除吗?")]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            try {
              await api.deleteItem({ id });
              this.$message({
                type: "success",
                message: "删除成功"
              });
              instance.confirmButtonLoading = false;
              done();
              this.fetchData();
            } catch (error) {
              done();
              instance.confirmButtonLoading = false;
            }
          } else {
            done();
          }
        }
      });
    },
    updateItem(id, status) {
      const msg = status === 1 ? "确定下架?" : "确定上架?";
      const h = this.$createElement;
      this.$msgbox({
        title: "提示",
        message: h("p", null, [h("span", null, msg)]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            try {
              await api.disItem({ id });
              this.$message({
                type: "success",
                message: "操作成功"
              });
              instance.confirmButtonLoading = false;
              done();
              this.fetchData();
            } catch (error) {
              done();
              instance.confirmButtonLoading = false;
            }
          } else {
            done();
          }
        }
      });
    },
    addtem() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          try {
            this.loading.add = true;
            if (this.dialogType === 1) {
              await api.addtem(this.addQuery);
            } else {
              await api.updateItem(this.addQuery);
            }
            this.$message.success("操作成功");
            this.dialog.add = false;
            this.loading.add = false;
            this.resetForm();
            this.fetchData();
          } catch (error) {
            this.loading.add = false;
          }
        } else {
          return false;
        }
      });
    },
    resetForm(flag) {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      if (flag) {
        this.addQuery = {
          title: "",
          url: "",
          priority: 1
        };
        this.fileList = [];
      }
    },
    beforOpenDialog(type, item) {
      if (type === 1) {
        this.resetForm(1);
      } else {
        this.resetForm();
        const { id, title, url, priority } = item;
        this.addQuery = { ...this.addQuery, id, title, url, priority };
        this.fileList = [{ name: "", url }];
      }
      this.dialogType = type;
      this.dialog.add = true;
    },
    setSort() {
      const vm = this;
      const el = this.$refs.dragTable.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost",
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: async ({ oldIndex, newIndex }) => {
          if (oldIndex === newIndex) return;
          vm.loading.list = true;
          let {
            id: oldId,
            priority: oldPriority,
            title: oldTitle,
            url: oldUrl
          } = this.list[oldIndex];
          let newRow = this.list[newIndex];
          let {
            id: newId,
            priority: newPriority,
            title: newTitle,
            url: newUrl
          } = newRow;
          try {
            await Promise.all([
              api.updateItem({
                id: oldId,
                priority: newPriority,
                title: oldTitle,
                url: oldUrl
              }),
              api.updateItem({
                id: newId,
                priority: oldPriority,
                title: newTitle,
                url: newUrl
              })
            ]);
            let oldRow = this.list.splice(oldIndex, 1)[0];
            oldRow.priority = newPriority;
            newRow.priority = oldPriority;
            this.list.splice(newIndex, 0, oldRow);
          } catch (error) {
            vm.loading.list = false;
          }
          vm.loading.list = false;
          vm.fetchData();
        }
      });
    }
  },
  computed: {
    diglogTitle() {
      return this.dialogType === 1 ? "新增轮播图" : "编辑轮播图";
    }
  }
};
</script>
