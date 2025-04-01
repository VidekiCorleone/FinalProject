using MySql.Data.MySqlClient;
using project_alpha_0._1.osztalyok;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1.userCoontrol_ok
{
    internal class userControlProfile : UserControl
    {
        public Label label1;
        public TextBox textBox1;
        public TextBox textBox2;
        public Label label2;
        public TextBox textBox3;
        public Label label3;
        public TextBox textBox4;
        private Panel panel1;
        public Label label4;

        public userControlProfile()
        {
            InitializeComponent();
            DatabaseManager();
            Start();
        }

        public void Start()
        {
            label1.Text = "Név: ";
            label1.BackColor = Color.FromArgb(169, 196, 108);
            label2.Text = "Felhasználónév: ";
            label2.BackColor = Color.FromArgb(169, 196, 108);
            label3.Text = "E-mail: ";
            label3.BackColor = Color.FromArgb(169, 196, 108);
            label4.Text = "Telefonszám: ";
            label4.BackColor = Color.FromArgb(169, 196, 108);

            this.BackColor = Color.FromArgb(244, 255, 195);
            panel1.BackColor = Color.FromArgb(128, 157, 60);
            

            var userDataList = GetUserData();
            if (userDataList.Count > 0)
            {
                for (int i = 0; i < userDataList.Count; i++)
                {
                    var userData = userDataList[0];
                    textBox1.Text = userData.name;
                    textBox1.Enabled = false;
                    textBox2.Text = userData.username;
                    textBox2.Enabled = false;
                    textBox3.Text = userData.email;
                    textBox3.Enabled = false;
                    textBox4.Text = userData.phoneNumber.ToString();
                    textBox4.Enabled = false;
                }
                
            }
        }

        public string connectionString;

        public void DatabaseManager()
        {
            connectionString = "server=localhost;database=parkhouse;user=root;password=;";
        }

        public List<userData> userDataList = new List<userData>();

        public List<userData> GetUserData()
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"
                        SELECT 
                            name,
                            username,
                            email,
                            phone_num
                        FROM users";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            userDataList.Add(new userData
                            {
                                name = reader.IsDBNull(0) ? string.Empty : reader.GetString(0),
                                username = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                                email = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                                phoneNumber = reader.IsDBNull(3) ? 0 : reader.GetInt32(3)
                            });
                        }
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Adatbázis hiba: {ex.Message}");
                throw;
            }

            return userDataList;
        }

        private void InitializeComponent()
        {
            this.label1 = new System.Windows.Forms.Label();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.textBox2 = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.textBox3 = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.textBox4 = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.BackColor = System.Drawing.Color.Maroon;
            this.label1.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label1.Location = new System.Drawing.Point(15, 20);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(41, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "label1";
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(149, 18);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(133, 20);
            this.textBox1.TabIndex = 1;
            // 
            // textBox2
            // 
            this.textBox2.Location = new System.Drawing.Point(149, 44);
            this.textBox2.Name = "textBox2";
            this.textBox2.Size = new System.Drawing.Size(133, 20);
            this.textBox2.TabIndex = 3;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.BackColor = System.Drawing.Color.Maroon;
            this.label2.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label2.Location = new System.Drawing.Point(15, 46);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(41, 15);
            this.label2.TabIndex = 2;
            this.label2.Text = "label2";
            // 
            // textBox3
            // 
            this.textBox3.Location = new System.Drawing.Point(149, 70);
            this.textBox3.Name = "textBox3";
            this.textBox3.Size = new System.Drawing.Size(133, 20);
            this.textBox3.TabIndex = 5;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.BackColor = System.Drawing.Color.Maroon;
            this.label3.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label3.Location = new System.Drawing.Point(15, 72);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(41, 15);
            this.label3.TabIndex = 4;
            this.label3.Text = "label3";
            // 
            // textBox4
            // 
            this.textBox4.Location = new System.Drawing.Point(149, 96);
            this.textBox4.Name = "textBox4";
            this.textBox4.Size = new System.Drawing.Size(133, 20);
            this.textBox4.TabIndex = 7;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.BackColor = System.Drawing.Color.Maroon;
            this.label4.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label4.Location = new System.Drawing.Point(15, 98);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(41, 15);
            this.label4.TabIndex = 6;
            this.label4.Text = "label4";
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.Maroon;
            this.panel1.Controls.Add(this.label4);
            this.panel1.Controls.Add(this.textBox4);
            this.panel1.Controls.Add(this.label3);
            this.panel1.Controls.Add(this.label2);
            this.panel1.Controls.Add(this.textBox3);
            this.panel1.Controls.Add(this.label1);
            this.panel1.Controls.Add(this.textBox1);
            this.panel1.Controls.Add(this.textBox2);
            this.panel1.Location = new System.Drawing.Point(3, 3);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(294, 169);
            this.panel1.TabIndex = 8;
            // 
            // userControlProfile
            // 
            this.BackColor = System.Drawing.Color.Black;
            this.Controls.Add(this.panel1);
            this.Name = "userControlProfile";
            this.Size = new System.Drawing.Size(300, 175);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.ResumeLayout(false);

        }
    }
}
